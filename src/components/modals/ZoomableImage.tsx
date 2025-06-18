// ZoomableImageModal.tsx
import React, { useState } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons'; // Para el icono de la X

const { width, height } = Dimensions.get('window');

interface ZoomableImageModalProps {
  uri: string;
  thumbnailSize?: number; // Tamaño de la miniatura
}

const ZoomableImageModal: React.FC<ZoomableImageModalProps> = ({
  uri,
  thumbnailSize = 150,
}) => {
  const [visible, setVisible] = useState(false);

  const scale = useSharedValue(1);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);

  const pinch = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = event.scale;
      focalX.value = event.focalX;
      focalY.value = event.focalY;
    })
    .onEnd(() => {
      if (scale.value < 1) {
        scale.value = withSpring(1);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: focalX.value },
        { translateY: focalY.value },
        { scale: scale.value },
        { translateX: -focalX.value },
        { translateY: -focalY.value },
      ],
    };
  });

  return (
    <>
      {/* Miniatura como imagen */}
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Image
          source={{ uri }}
          style={{
            width: thumbnailSize,
            height: thumbnailSize,
            borderRadius: 10,
            resizeMode: 'cover',
          }}
        />
      </TouchableOpacity>

      {/* Modal con imagen grande */}
      <Modal visible={visible} transparent={true} animationType="fade">
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.95)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          activeOpacity={1}
          onPress={(e) => {
            // Evita cerrar si se toca la imagen
            if (e.target === e.currentTarget) {
              setVisible(false);
            }
          }}
        >
          <GestureHandlerRootView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: 40,
                right: 20,
                zIndex: 10,
                padding: 10,
                backgroundColor: 'black',
                borderRadius: 30,
                borderWidth: 1,
                borderColor: '#FFD700',
              }}
              onPress={() => setVisible(false)}
            >
              <Feather name="x" size={24} color="#FFD700" />
            </TouchableOpacity>

            <GestureDetector gesture={pinch}>
              <Animated.View
                style={{
                  width: width * 0.9,
                  height: height * 0.7,
                  overflow: 'hidden',
                }}
              >
                <Animated.Image
                  source={{ uri }}
                  style={[
                    {
                      width: '100%',
                      height: '100%',
                      resizeMode: 'contain',
                    },
                    animatedStyle,
                  ]}
                />
              </Animated.View>
            </GestureDetector>
          </GestureHandlerRootView>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default ZoomableImageModal;