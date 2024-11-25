// Marker.js
import React, { useEffect } from "react";
import * as THREE from "three";

const Marker = ({ lat, lon, scene }) => {
  useEffect(() => {
    // Convert latitude and longitude to radians
    const latRad = THREE.MathUtils.degToRad(lat);
    const lonRad = THREE.MathUtils.degToRad(lon);

    // Radius of the Earth
    const earthRadius = 2; // The radius of the Earth in your scene

    // Calculate the position of the marker
    const x = earthRadius * Math.cos(latRad) * Math.cos(lonRad);
    const y = earthRadius * Math.sin(latRad);
    const z = earthRadius * Math.cos(latRad) * Math.sin(lonRad);

    // Create a marker (a small sphere)
    const geometry = new THREE.SphereGeometry(0.1, 16, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const marker = new THREE.Mesh(geometry, material);

    // Set marker position
    marker.position.set(x, y, z);

    // Add marker to the scene
    scene.add(marker);

    return () => {
      // Cleanup marker when component is unmounted
      scene.remove(marker);
    };
  }, [lat, lon, scene]);

  return null;
};

export default Marker;