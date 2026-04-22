import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

type Poem = {
  author: string;
  lines: string[];
};

export default function Index() {
  const [poetry, setPoetry] = useState<Poem[]>([]);
  const [linesShown, setLinesShown] = useState<number>(1);

  const fetchPoetry = () => {
    fetch("https://poetrydb.org/random")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setPoetry(data);
      });
  };

  useEffect(() => {
    fetchPoetry();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Guess the Poet</Text>
      <ScrollView>
        {poetry[0]?.lines.slice(0, linesShown).map((line) => (
          <Text key={line}>{line}</Text>
        ))}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
});
