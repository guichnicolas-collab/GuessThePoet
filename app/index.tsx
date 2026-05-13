import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type Poem = {
  author: string;
  lines: string[];
};

function getRandomInteger(max: number) {
  return Math.floor(Math.random() * max);
}

export default function Index() {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [linesShown, setLinesShown] = useState<number>(1);
  const [correctPoemIndex, setCorrectPoemIndex] = useState<
    number | undefined
  >();
  const [score, setScore] = useState<number>(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  let scrollViewRef = useRef<ScrollView | null>(null);
  const fallbackPoetsRef = useRef<Set<string>>(
    new Set([
      "Amy Levy",
      "John Milton",
      "Geoffrey Chaucer",
      "Alexander Pope",
      "Percy Bysshe Shelley",
      "Isaac Watts",
      "Edgar Allan Poe",
    ]),
  );

  const fetchPoetry = useCallback(() => {
    fetch("https://poetrydb.org/random/4")
      .then((res) => res.json())
      .then((data) => {
        const correctAnswerIndex = getRandomInteger(data.length);
        for (let i = 0; i < data.length; i++) {
          if (
            i !== correctAnswerIndex &&
            data.some(
              (poem: Poem, index: number) =>
                poem.author === data[i].author && index !== i,
            )
          ) {
            const pool = [...fallbackPoetsRef.current];
            data[i].author = pool[getRandomInteger(pool.length)];
          }
        }
        for (const poem of data) {
          fallbackPoetsRef.current.add(poem.author);
        }
        setPoems(data);
        setCorrectPoemIndex(correctAnswerIndex);
      });
  }, []);

  useEffect(() => {
    fetchPoetry();
  }, [fetchPoetry]);

  const handleButtonPress = () => {
    if (!correctPoemIndex) return;

    if (poems[correctPoemIndex].lines[linesShown + 1]) {
      setLinesShown((prev) => prev + 1);
    } else {
      setLinesShown((prev) => prev + 2);
    }
  };

  const selectPoet = (index: number) => {
    setIsCorrect(index === correctPoemIndex);
    setPoems([]);
    fetchPoetry();
    setCorrectPoemIndex(undefined);
    setLinesShown(1);
    setTimeout(() => {
      setIsCorrect(null);
    }, 1000);
  };

  if (isCorrect !== null) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ fontWeight: "bold", fontSize: 24 }}>
          {isCorrect ? "Correct" : "Incorrect"}
        </Text>
      </View>
    );
  }

  if (poems.length === 0 || correctPoemIndex === undefined) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const isNewLineButtonEnabled =
    linesShown < poems[correctPoemIndex].lines.length;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Poet Guessr</Text>
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={() => {
          if (scrollViewRef) {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }
        }}
        style={{ marginBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {poems[correctPoemIndex].lines
          .slice(0, linesShown)
          .map((line, index) => (
            <Text key={index} style={{ marginBottom: 6, fontSize: 16 }}>
              {line.trim()}
            </Text>
          ))}
      </ScrollView>
      <View style={{ gap: 5 }}>
        {poems.map((poem, index) => (
          <Pressable
            key={index}
            style={styles.poetChoiceButton}
            onPress={() => {
              selectPoet(index);
            }}
          >
            <Text>{poem.author}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable
        onPress={handleButtonPress}
        style={
          isNewLineButtonEnabled
            ? styles.newLineButton
            : styles.disabledNewLineButton
        }
        disabled={!isNewLineButtonEnabled}
      >
        <Text style={styles.newLineText}>New Line</Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
  },
  newLineButton: {
    alignSelf: "center",
    padding: 12,
    backgroundColor: "black",
    borderRadius: 10,
    marginTop: 16,
  },
  disabledNewLineButton: {
    alignSelf: "center",
    padding: 12,
    backgroundColor: "lightgray",
    borderRadius: 10,
    marginTop: 16,
  },
  newLineText: {
    color: "white",
    fontWeight: "bold",
  },
  poetChoiceButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "gray",
    paddingHorizontal: 6,
    paddingVertical: 12,
    borderRadius: 10,
  },
});
