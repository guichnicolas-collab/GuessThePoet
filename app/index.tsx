import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type Poem = {
  author: string;
  lines: string[];
};

export default function Index() {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [linesShown, setLinesShown] = useState<number>(1);
  const [correctPoemIndex, setCorrectPoemIndex] = useState<
    number | undefined
  >();
  const [score, setScore] = useState<number>(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const fetchPoetry = useCallback(() => {
    fetch("https://poetrydb.org/random/4")
      .then((response) => response.json())
      .then((data) => {
        setPoems(data);
        setCorrectPoemIndex(Math.floor(Math.random() * data.length));
      });
  }, []);

  useEffect(() => {
    fetchPoetry();
  }, [fetchPoetry]);

  const handleButtonPress = () => {
    setLinesShown((prev) => prev + 1);
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
        <Text>{isCorrect ? "Correct" : "Incorrect"}</Text>
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Guess the Poet</Text>
      <ScrollView>
        {poems[correctPoemIndex].lines
          .slice(0, linesShown)
          .map((line, index) => (
            <Text key={index}>{line}</Text>
          ))}
      </ScrollView>
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
      <Pressable onPress={handleButtonPress} style={styles.newLineButton}>
        <Text style={styles.newLineText}>New Line</Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 60,
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
  },
  newLineText: {
    color: "white",
    fontWeight: "bold",
  },
  poetChoiceButton: {
    backgroundColor: "lightgray",
    padding: 6,
    borderRadius: 10,
  },
});
