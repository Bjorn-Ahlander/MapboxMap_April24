// mapboxgl.accessToken = 'PUT YOUR ACCES-TOKEN HERE';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    projection: 'globe', // Display the map as a globe, since satellite-v9 defaults to Mercator
    zoom: 2,
    center: [30, 15]
});

// Add navigation control
map.addControl(new mapboxgl.NavigationControl());
map.scrollZoom.disable();

    map.on('style.load', () => {
        map.setFog({}); // Set the default atmosphere style
    });

    // The following values can be changed to control rotation speed:

    // At low zooms, complete a revolution every two minutes.
    const secondsPerRevolution = 40;
    // Above zoom level 5, do not rotate.
    const maxSpinZoom = 5;
    // Rotate at intermediate speeds between zoom levels 3 and 5.
    const slowSpinZoom = 3;

    let userInteracting = false;
    const spinEnabled = true;

    function spinGlobe() {
        const zoom = map.getZoom();
        if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
            let distancePerSecond = 360 / secondsPerRevolution;
            if (zoom > slowSpinZoom) {
                // Slow spinning at higher zooms
                const zoomDif =
                    (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
                distancePerSecond *= zoomDif;
            }
            const center = map.getCenter();
            center.lng -= distancePerSecond;
            // Smoothly animate the map over one second.
            // When this animation is complete, it calls a 'moveend' event.
            map.easeTo({ center, duration: 1000, easing: (n) => n });
        }
    }

    // Pause spinning on interaction
    map.on('mousedown', () => {
        userInteracting = true;
    });
    map.on('dragstart', () => {
        userInteracting = true;
    });

    // When animation is complete, start spinning if there is no ongoing interaction
    map.on('moveend', () => {
        spinGlobe();
    });

    spinGlobe();

// Function to place a marker on the map with name, phone number, and address
function placeMarker(coordinates, name, phoneNumber, address) {
    const marker = new mapboxgl.Marker()
        .setLngLat(coordinates)
        .addTo(map);

    // Create popup content with form information
    const popupContent = `
        <h3>Marker Popup</h3>
        <p>Name: ${name}</p>
        <p>Phone Number: ${phoneNumber}</p>
        <p>Address: ${address}</p>
    `;

    const popup = new mapboxgl.Popup({ closeOnClick: false })
        .setHTML(popupContent)
        .addTo(map);

        marker.setPopup(popup); // Associate popup with marker    

    console.log('Popup Content:', popupContent); // Log popup content
}

// Form submission handler
document.getElementById('marker-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const latitude = parseFloat(document.getElementById('latitude').value);
    const longitude = parseFloat(document.getElementById('longitude').value);
    const name = document.getElementById('name').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const address = document.getElementById('address').value;

    if (!isNaN(latitude) && !isNaN(longitude) && name.trim() !== '' && phoneNumber.trim() !== '' && address.trim() !== '') {
        const coordinates = [longitude, latitude];
        placeMarker(coordinates, name, phoneNumber, address);

        // Clear form inputs
        document.getElementById('latitude').value = '';
        document.getElementById('longitude').value = '';
        document.getElementById('name').value = '';
        document.getElementById('phoneNumber').value = '';
        document.getElementById('address').value = '';
        
    } else {
        alert('Please enter valid latitude, longitude, name, phone number, and address.');
        alert.backgroundColor = "blue";
        //document.getElementById('popupContent').style.backgroundColor = "blue";
    }
});

//<script>

//</script>


