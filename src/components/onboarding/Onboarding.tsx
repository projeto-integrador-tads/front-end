import React from "react";
import {
  View,
  Text,
  useWindowDimensions,
  StyleSheet,
  Image,
} from "react-native";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
  interpolate,
  useAnimatedStyle,
  withTiming,
  SharedValue,
} from "react-native-reanimated";
import { Button } from "@/components/button/Button";
import { typography } from "@/styles/shared/typography/typography";
import { colors } from "@/styles/shared/colors/colors";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const slides = [
  {
    id: 1,
    title: "Bem-vindo ao VemComigo!",
    description:
      "Encontre caronas seguras e econômicas para suas viagens diárias.",
    image: require("@/assets/images/onboarding/slide1.jpg"),
  },
  {
    id: 2,
    title: "Viaje com Segurança",
    description:
      "Todos os motoristas são verificados e avaliados pela comunidade.",
    image: require("@/assets/images/onboarding/slide2.jpg"),
  },
  {
    id: 3,
    title: "Economize Tempo e Dinheiro",
    description:
      "Compartilhe os custos da viagem e ajude a reduzir o trânsito.",
    image: require("@/assets/images/onboarding/slide3.jpg"),
  },
];

interface OnboardingItemProps {
  item: (typeof slides)[0];
  index: number;
  scrollX: SharedValue<number>;
}

function OnboardingItem({ item, index, scrollX }: OnboardingItemProps) {
  const { width } = useWindowDimensions();

  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const rTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollX.value, inputRange, [0, 1, 0], "clamp");

    const translateY = interpolate(
      scrollX.value,
      inputRange,
      [15, 0, 15],
      "clamp"
    );

    return {
      opacity: withTiming(opacity, { duration: 200 }),
      transform: [{ translateY: withTiming(translateY, { duration: 200 }) }],
    };
  });

  return (
    <View style={[styles.itemContainer, { width }]}>
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} resizeMode="cover" />
        <LinearGradient
          colors={["transparent", colors.neutral.white]}
          locations={[0, 0.6]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      </View>
      <Animated.View style={[styles.textContainer, rTextStyle]}>
        <Text style={[typography.h1, styles.title]}>{item.title}</Text>
        <Text style={[typography.body1, styles.description]}>
          {item.description}
        </Text>
      </Animated.View>
    </View>
  );
}

interface PaginationProps {
  scrollX: SharedValue<number>;
  width: number;
}

function Pagination({ scrollX, width }: PaginationProps) {
  return (
    <View style={styles.paginationContainer}>
      {slides.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

        const animatedDotStyle = useAnimatedStyle(() => {
          const dotWidth = interpolate(
            scrollX.value,
            inputRange,
            [8, 24, 8],
            "clamp"
          );

          const opacity = interpolate(
            scrollX.value,
            inputRange,
            [0.5, 1, 0.5],
            "clamp"
          );

          const isActive = Math.abs(scrollX.value - i * width) < width / 2;

          return {
            width: withTiming(dotWidth, { duration: 300 }),
            opacity: withTiming(opacity, { duration: 300 }),
            backgroundColor: isActive 
              ? colors.primary.normal.default 
              : colors.neutral.gray2,
          };
        });

        return <Animated.View key={i} style={[styles.dot, animatedDotStyle]} />;
      })}
    </View>
  );
}

export function Onboarding() {
  const scrollX = useSharedValue(0);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const { width } = useWindowDimensions();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={width}
      >
        {slides.map((item, index) => (
          <OnboardingItem
            key={item.id}
            item={item}
            index={index}
            scrollX={scrollX}
          />
        ))}
      </Animated.ScrollView>

      <View style={styles.footer}>
        <Pagination scrollX={scrollX} width={width} />
        <View style={styles.buttonContainer}>
          <Link href="/(auth)/login" asChild>
            <Button>Login</Button>
          </Link>
          <Link href="/(auth)/signup" asChild>
            <Button variant="outline">Crie uma conta</Button>
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },
  itemContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "55%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "40%",
  },
  textContainer: {
    position: "absolute",
    top: "60%",
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    textAlign: "center",
    color: colors.neutral.gray2,
    paddingHorizontal: 16,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 32,
    backgroundColor: colors.neutral.white,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
    height: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonContainer: {
    gap: 12,
  },
});
