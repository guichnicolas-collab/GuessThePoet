import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type Poem = {
  author: string;
  lines: string[];
};

const knuthShuffle = (array: string[]) => {
  let currentIndex = array.length;
  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
};

export default function Index() {
  const [poem, setPoem] = useState<Poem | null>(null);
  const [poets, setPoets] = useState<string[]>([]);
  const [linesShown, setLinesShown] = useState<number>(1);
  const [possibleAuthors, setPossibleAuthors] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  let scrollViewRef = useRef<ScrollView | null>(null);

  const loadPoets = useCallback(() => {
    fetch("https://poetrydb.org/authors")
      .then((res) => res.json())
      .then((data: { authors: string[] }) => {
        setPoets(data.authors);
      });
  }, []);

  const fetchPoetry = useCallback(() => {
    fetch("https://poetrydb.org/random/1")
      .then((res) => res.json())
      .then((data) => {
        const poetsCopy = [...poets];
        const correctAuthor = data[0].author;
        poetsCopy.splice(poetsCopy.indexOf(correctAuthor), 1);
        knuthShuffle(poetsCopy);
        const choices = poetsCopy.slice(0, 3);
        choices.push(correctAuthor);
        knuthShuffle(choices);
        setPoem(data[0]);
        setPossibleAuthors(choices);
      });
  }, [poets]);

  useEffect(() => {
    loadPoets();
  }, [loadPoets]);

  useEffect(() => {
    if (poets.length !== 0) {
      fetchPoetry();
    }
  }, [fetchPoetry, poets.length]);

  const addLine = () => {
    if (!poem) return;

    if (poem?.lines[linesShown + 1]) {
      setLinesShown((prev) => prev + 1);
    } else {
      setLinesShown((prev) => prev + 2);
    }
  };

  const selectPoet = (author: string) => {
    setIsCorrect(author === poem?.author);
    setPoem(null);
    fetchPoetry();
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

  if (poem === null) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const isNewLineButtonEnabled = linesShown < poem?.lines.length;

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
        {poem?.lines.slice(0, linesShown).map((line, index) => (
          <Text key={index} style={{ marginBottom: 6, fontSize: 16 }}>
            {line.trim()}
          </Text>
        ))}
      </ScrollView>
      <View style={{ gap: 5 }}>
        {possibleAuthors.map((author, index) => (
          <Pressable
            key={index}
            style={styles.poetChoiceButton}
            onPress={() => {
              selectPoet(author);
            }}
          >
            <Text>{author}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable
        onPress={addLine}
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
