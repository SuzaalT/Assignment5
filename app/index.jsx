import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, TextInput, Button, Alert } from "react-native";
import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import * as THREE from "three";
import Marker from "../componets/Marker"; // Import the Marker component

export default function HomeScreen() {
  const [location, setLocation] = useState(""); // State for location input
  const [markerPosition, setMarkerPosition] = useState(null); // State for storing marker position
  const earthRef = useRef(null); // Reference for the 3D Earth object
  const sceneRef = useRef(null); // Reference for the 3D scene

  // Function to get coordinates from GeoCode.xyz
  const getCoordinates = async () => {
    const url = `https://geocode.xyz/${location}?json=1`; // GeoCode.xyz endpoint
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.error) {
        Alert.alert("Error", "Location not found.");
        return;
      }
      const { latt, longt } = data; // Get latitude and longitude
      console.log(`Latitude: ${latt}, Longitude: ${longt}`); // Check the latitude and longitude
      setMarkerPosition({ lat: latt, lng: longt }); // Update marker position
    } catch (error) {
      Alert.alert("Error", "Unable to fetch location data.");
    }
  };

  // 3D Earth rendering logic
  const onContextCreate = (gl) => {
    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    sceneRef.current = scene; // Store the scene reference

    // Earth texture and geometry
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load(
      "https://unpkg.com/three-globe/example/img/earth-night.jpg"
    );
    const geometry = new THREE.SphereGeometry(2, 32, 32);
    const material = new THREE.MeshStandardMaterial({ map: earthTexture });
    const earth = new THREE.Mesh(geometry, material);
    scene.add(earth);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 5);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 8);
    directionalLight.position.set(5, 10, 10).normalize();
    scene.add(ambientLight);
    scene.add(directionalLight);

    camera.position.set(0, 1, 8);
    earth.rotation.x = THREE.MathUtils.degToRad(23.5); // Earth tilt

    const animate = () => {
      requestAnimationFrame(animate);
      earth.rotation.y += 0.015; // Rotate the Earth slowly
      renderer.render(scene, camera);

      gl.endFrameEXP();
    };

    animate();
  };

  return (
    <View style={styles.container}>
      {/* Input for location search */}
      <TextInput
        style={styles.input}
        placeholder="Enter a location (e.g., New York)"
        value={location}
        onChangeText={setLocation}
      />
      <Button title="Search Location" onPress={getCoordinates} />

      {/* Render GLView to show Earth 3D */}
      <GLView
        style={styles.glView}
        onContextCreate={onContextCreate}
      />

      {/* Render the Marker Component when a location is searched */}
      {markerPosition && sceneRef.current && (
        <Marker
          lat={parseFloat(markerPosition.lat)}
          lon={parseFloat(markerPosition.lng)}
          scene={sceneRef.current}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    width: "80%",
    color: "#fff"
  },
  glView: {
    width: "100%",
    height: "60%",
  },
});
