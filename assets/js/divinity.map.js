/* ========================================================================
 * Divinity: divinity.map.js
 * Initialises google maps
 * ========================================================================
 * Copyright 2016 Oxygenna LTD
 * ======================================================================== */

/* global google */

/* change the variables below to modify your map position / style & markers */
window.map = {
    map_type: 'ROADMAP',
    auto_zoom: 'manual',                                        // set to 'manual' to set the zoom manually. Leave empty for auto zoom
    map_zoom: 7,                                                // set the zoom if auto_zoom is set to
    map_scrollable: 'on',                                       // makes the map draggable
    map_style: 'retro',                                         // if set to blackwhite it takes a black/white saturation
    addresses: ['London', 'Paris'],                             // addresses separated by comma. Addresses are picked up first
    latlngs : ['51.511084, -0.133202', '51.506623, -0.111916'], // Lat/Lng separated by comma. if no addresses are set these coordinates will get used
    labels: ['London', 'Paris'],                                // labels that will be added to the markeres respectively. Keep the same number as markers
    auto_center: 'auto',                                        // center the map 'auto' or 'custom'
    center_latlng: '',                                          // centers the map to this point, unless it is set to auto
    show_markers: 'on',                                         // shows/Hides the markers
    markerURL: 'assets/images/marker.png'                       // the marker URL
};

jQuery(document).ready(function($) {

    /********************
     Google Maps
    /*******************/
    $('.google-map').each(function() {
        var mapDiv = $(this);
        var mapData = window[mapDiv.attr('id')];
        $(window).resize(function() {
            googleMap(mapDiv, mapData);
        });
        googleMap(mapDiv, mapData);
    });

    // Google Map
    function googleMap(element, data) {
        if(undefined === window.google) {
            $.getScript('https://maps.googleapis.com/maps/api/js?v=3.22', function() {
                createMap(element, data);
            });
        } else {
            createMap(element, data);
        }
    }

    function createMap(element, data) {
        // create map
        var map = createGoogleMap(element, data);
        data.bounds = new google.maps.LatLngBounds();

        setupMarkers(map, element, data);

        var boundsListener;
        if(data.auto_zoom === 'manual') {
            boundsListener = google.maps.event.addListener(map, 'bounds_changed', function() {
                this.setZoom(parseInt(data.map_zoom));
                google.maps.event.removeListener(boundsListener);
            });
        } else {
            if(undefined !== boundsListener) {
                google.maps.event.removeListener(boundsListener);
            }
        }
    }

    function createGoogleMap(element, data) {
        var options = {
            zoom: parseInt(data.map_zoom, 10),
            scrollwheel: false,
            draggable: data.map_scrollable === 'on',
            mapTypeId: google.maps.MapTypeId[data.map_type]
        };

        if(data.map_style === 'blackwhite') {
            options.styles = [{
                'stylers': [{
                    'saturation': -100
                }]
            }];
        }

        if(data.map_style === 'retro') {
            options.styles = [{'featureType':'administrative', 'elementType':'labels.text.fill', 'stylers':[{'color':'#575e66'}]}, {'featureType':'landscape', 'elementType':'all', 'stylers':[{'color':'#f8f2e6'}]}, {'featureType':'poi', 'elementType':'all', 'stylers':[{'visibility':'off'}]}, {'featureType':'road', 'elementType':'all', 'stylers':[{'saturation':-100}, {'lightness':45}, {'visibility':'simplified'}]}, {'featureType':'road.highway', 'elementType':'all', 'stylers':[{'visibility':'simplified'}]}, {'featureType':'road.highway', 'elementType':'labels', 'stylers':[{'visibility':'off'}]}, {'featureType':'road.arterial', 'elementType':'labels.icon', 'stylers':[{'visibility':'off'}]}, {'featureType':'transit', 'elementType':'all', 'stylers':[{'visibility':'off'}]}, {'featureType':'water', 'elementType':'all', 'stylers':[{'color':'#c9bfac'}, {'visibility':'on'}, {'saturation':'0'}, {'lightness':'50'}]}];
        }
        return new google.maps.Map(element[0], options);
    }

    function setupMarkers(map, mapDiv, mapData) {
        mapData.markers = [];
        if(mapData.addresses) {
            geocodeMarkerList(map, mapData);
        } else if(mapData.latlngs) {
            latLngMarkerList(map, mapData);
        }
    }

    function geocodeMarkerList(map, mapData) {
        // lookup addresses
        var markerAddressCount = 0;
        $.each(mapData.addresses, function(index, address) {
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({
                'address': address
            }, function(results, status) {
                if(status === google.maps.GeocoderStatus.OK) {
                    if(undefined !== results[0]) {
                        var location = results[0].geometry.location;
                        mapData.markers[index] = {
                            position: new google.maps.LatLng(location.lat(), location.lng())
                        };
                        mapData.bounds.extend(mapData.markers[index].position);
                    }
                    // increment count so we can keep track of all markers loaded
                    markerAddressCount++;
                    // if all markers are loaded then fit map
                    if(markerAddressCount === mapData.addresses.length) {
                        createMarkers(map, mapData);
                    }
                }
            });
        });
    }

    function latLngMarkerList(map, mapData) {
        for(var index = 0; index < mapData.latlngs.length; index++) {
            var coordinates = mapData.latlngs[index].split(',');
            mapData.markers[index] = {
                position: new google.maps.LatLng(coordinates[0], coordinates[1])
            };
            mapData.bounds.extend(mapData.markers[index].position);
        }
        createMarkers(map, mapData);
    }

    function createMarkers(map, mapData) {

        $.each(mapData.markers, function(index, marker) {
            var markerData = {
                position: marker.position,
                icon: mapData.markerURL,
                visible: mapData.show_markers === 'on',
                map: map
            };
            var mapMarker = new google.maps.Marker(markerData);
            mapMarker.setMap(map);
            // add label popup to marker
            if (mapData.labels[index] !== undefined) {
                var infoWindow = new google.maps.InfoWindow({
                    content: mapData.labels[index]
                });
                google.maps.event.addListener(mapMarker, 'click', function() {
                    infoWindow.open(map, this);
                });
            }
        });
        centerMap(map, mapData);
    }

    function centerMap(map, mapData) {
        // centre map
        if(mapData.auto_center === 'auto') {
            if(mapData.auto_zoom === 'manual') {
                map.setCenter(mapData.bounds.getCenter());
            } else {
                map.fitBounds(mapData.bounds);
            }
        } else {
            if (mapData.center_latlng !== '') {
                var center_lat_lng = mapData.center_latlng.split(',');
                var center_map = new google.maps.LatLng(center_lat_lng[0], center_lat_lng[1]);
                map.setCenter(center_map);
            } else {
                map.fitBounds(mapData.bounds);
            }
        }
    }
});
