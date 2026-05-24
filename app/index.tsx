import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type Poem = {
  author: string;
  lines: string[];
};

const poets = [
  "Adam Lindsay Gordon",
  "Alan Seeger",
  "Alexander Pope",
  "Algernon Charles Swinburne",
  "Ambrose Bierce",
  "Amy Levy",
  "Andrew Marvell",
  "Ann Taylor",
  "Anne Bradstreet",
  "Anne Bronte",
  "Anne Killigrew",
  "Anne Kingsmill Finch",
  "Annie Louisa Walker",
  "Arthur Hugh Clough",
  "Ben Jonson",
  "Charles Kingsley",
  "Charles Sorley",
  "Charlotte Bronte",
  "Charlotte Smith",
  "Christina Rossetti",
  "Christopher Marlowe",
  "Christopher Smart",
  "Coventry Patmore",
  "Edgar Allan Poe",
  "Edmund Spenser",
  "Edward Fitzgerald",
  "Edward Lear",
  "Edward Taylor",
  "Edward Thomas",
  "Eliza Cook",
  "Elizabeth Barrett Browning",
  "Emily Bronte",
  "Emily Dickinson",
  "Emma Lazarus",
  "Ernest Dowson",
  "Eugene Field",
  "Francis Thompson",
  "Geoffrey Chaucer",
  "George Eliot",
  "George Gordon, Lord Byron",
  "George Herbert",
  "George Meredith",
  "Gerard Manley Hopkins",
  "Helen Hunt Jackson",
  "Henry David Thoreau",
  "Henry Vaughan",
  "Henry Wadsworth Longfellow",
  "Hugh Henry Brackenridge",
  "Isaac Watts",
  "James Henry Leigh Hunt",
  "James Thomson",
  "James Whitcomb Riley",
  "Jane Austen",
  "Jane Taylor",
  "John Clare",
  "John Donne",
  "John Dryden",
  "John Greenleaf Whittier",
  "John Keats",
  "John McCrae",
  "John Milton",
  "John Trumbull",
  "John Wilmot",
  "Jonathan Swift",
  "Joseph Warton",
  "Joyce Kilmer",
  "Julia Ward Howe",
  "Jupiter Hammon",
  "Katherine Philips",
  "Lady Mary Chudleigh",
  "Lewis Carroll",
  "Lord Alfred Tennyson",
  "Louisa May Alcott",
  "Major Henry Livingston, Jr.",
  "Mark Twain",
  "Mary Elizabeth Coleridge",
  "Matthew Arnold",
  "Matthew Prior",
  "Michael Drayton",
  "Oliver Goldsmith",
  "Oliver Wendell Holmes",
  "Oscar Wilde",
  "Paul Laurence Dunbar",
  "Percy Bysshe Shelley",
  "Philip Freneau",
  "Phillis Wheatley",
  "Ralph Waldo Emerson",
  "Richard Crashaw",
  "Richard Lovelace",
  "Robert Browning",
  "Robert Burns",
  "Robert Herrick",
  "Robert Louis Stevenson",
  "Robert Southey",
  "Robinson",
  "Rupert Brooke",
  "Samuel Coleridge",
  "Samuel Johnson",
  "Sarah Flower Adams",
  "Sidney Lanier",
  "Sir John Suckling",
  "Sir Philip Sidney",
  "Sir Thomas Wyatt",
  "Sir Walter Raleigh",
  "Sir Walter Scott",
  "Stephen Crane",
  "Thomas Campbell",
  "Thomas Chatterton",
  "Thomas Flatman",
  "Thomas Gray",
  "Thomas Hood",
  "Thomas Moore",
  "Thomas Warton",
  "Walt Whitman",
  "Walter Savage Landor",
  "Wilfred Owen",
  "William Allingham",
  "William Barnes",
  "William Blake",
  "William Browne",
  "William Cowper",
  "William Cullen Bryant",
  "William Ernest Henley",
  "William Lisle Bowles",
  "William Morris",
  "William Shakespeare",
  "William Topaz McGonagall",
  "William Vaughn Moody",
  "William Wordsworth",
];

export default function Index() {
  const [poem, setPoem] = useState<Poem | null>(null);
  const [linesShown, setLinesShown] = useState<number>(1);
  const [possibleAuthors, setPossibleAuthors] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  let scrollViewRef = useRef<ScrollView | null>(null);

  const fetchPoetry = useCallback(() => {
    fetch("https://poetrydb.org/random/1")
      .then((res) => res.json())
      .then((data) => {
        let currentIndex = poets.length;
        // While there remain elements to shuffle...
        while (currentIndex !== 0) {
          // Pick a remaining element...
          let randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
          // And swap it with the current element.
          [poets[currentIndex], poets[randomIndex]] = [
            poets[randomIndex],
            poets[currentIndex],
          ];
        }
        let choices = poets.slice(0, 3);
        choices.push(data[0].author);
        currentIndex = choices.length;
        // While there remain elements to shuffle...
        while (currentIndex !== 0) {
          // Pick a remaining element...
          let randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
          // And swap it with the current element.
          [choices[currentIndex], choices[randomIndex]] = [
            choices[randomIndex],
            choices[currentIndex],
          ];
        }
        setPoem(data[0]);
        setPossibleAuthors(choices);
      });
  }, []);

  useEffect(() => {
    fetchPoetry();
  }, [fetchPoetry]);

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
