import Expo from "expo";
import React, { Component } from "react";
import {
  Image,
  View,
  ScrollView,
  StyleSheet,
  Platform,
  Dimensions,
  StatusBar,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {
  Body,
  Header,
  Text,
  Title,
  Container,
  Content,
  Button,
  Spinner,
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  ReactiveBase,
  DataSearch,
  DataController,
  ReactiveList,
} from "@appbaseio/reactivebase-native";
import { web } from "react-native-communications";

import { APPBASE_CONFIG } from "./config";

var { height, width } = Dimensions.get("window");

if (Platform.OS === "android") {
  height = height - StatusBar.currentHeight;
}

const COLORS = {
  primary: "#1A237E",
  secondary: "#D1C4E9",
  seperator: "#EEEEEE"
};

const commons = {
  padding1: {
    padding: 10
  },
  padding2: {
    padding: 20
  },
  padding3: {
    padding: 30
  },
  padding4: {
    padding: 40
  },
  padding5: {
    padding: 50
  }
};

const styles = StyleSheet.create({
  fullWidth: {
    width: width
  },
  container: {
    flex: 1
  },
  column: {
    flexDirection: "column"
  },
  alignCenter: {
    justifyContent: "center",
    alignItems: "center"
  },
  header: {
    fontWeight: "bold",
    marginBottom: 20,
    color: "white"
  },
  controls: {
    ...commons.padding2,
    paddingTop: 0,
    backgroundColor: "#3cb371",
    alignItems: "stretch"
  },
  results: {
    ...commons.padding2
  },
  none: {
    display: "none"
  },
  flex: {
    display: "flex"
  },
  searchBooksContainer: {
    backgroundColor: "#ECEFF1",
    marginHorizontal: 8,
    marginVertical: 8
  },
  headerSeperator: {
    backgroundColor: COLORS.primary,
    padding: 8
  },
  header: {
    backgroundColor: COLORS.primary
  },
  headerIcon: {
    paddingLeft: 5,
    paddingRight: 10,
    paddingTop: 3,
    color: COLORS.secondary
  },
  headerBody: {
    flex: 1,
    flexDirection: "row"
  },
  headerTitle: {
    color: COLORS.secondary
  },
  booksRow: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 15,
    borderBottomColor: COLORS.seperator,
    borderBottomWidth: 0.5
  },
  booksRowContainer: {
    flex: 1,
    flexGrow: 1,
    paddingLeft: 15
  },
  booksImage: {
    height: null,
    width: null,
    flex: 1
  },
  bookInfoSection: {
    flex: 1,
    flexGrow: 2,
    flexWrap: "wrap",
    padding: 15
  },
  bookTitle: {
    fontWeight: "800",
    fontSize: 18
  },
  bookAuthorSection: {
    paddingTop: 2
  },
  bookAuthor: {
    color: "grey"
  },
  bookPublication: {
    paddingTop: 7
  },
  bookStars: {
    flex: 1,
    flexDirection: "row",
    paddingTop: 5
  },
  bookRatings: {
    marginTop: -3,
    paddingLeft: 5
  }
});

export default class App extends Component {

  state = {
    topics: [],
    showNav: false,
    isReady: false,
    statusBarColor: "#3cb371"
  }

  async componentWillMount() {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("native-base/Fonts/Ionicons.ttf"),
    });

    this.setState({ isReady: true });
  }

  renderBookCard = (bookData) => {
    return (
      <TouchableOpacity onPress={() => web("https://google.com/search?q=" + bookData.original_title)}>
        <View style={[styles.fullWidth, styles.booksRow]}>
          <View style={styles.booksRowContainer}>
            <Image
              source={{
                uri: bookData.image
              }}
              style={styles.booksImage}
            />
          </View>
          <View style={styles.bookInfoSection}>
            <Text style={styles.bookTitle}>{bookData.title}</Text>
            <Text style={styles.bookAuthorSection}>
              <Text style={styles.bookAuthor}>{bookData.authors}</Text>
            </Text>
            <Text style={styles.bookPublication}>
              Pub {bookData.original_publication_year}
            </Text>
            <View style={styles.bookStars}>
              {[...Array(bookData.average_rating_rounded)].map((e, i) => (
                <Icon
                  key={i}
                  name="star"
                  size={20}
                  color="gold"
                  style={{ color: "gold" }}
                />
              ))}
              <Text style={styles.bookRatings}>
                ({bookData.average_rating})
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  onAllData = (items) => {
    return (
      <FlatList
        style={{ width: '100%', marginTop: -25 }}
        data={items || []}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          this.renderBookCard(item)
        )}
      />
    )
  }

  renderTopBarSpacer = () => {
    // Fix status bar top space in Expo
    if (typeof Expo !== "undefined" && Platform.OS === "android") {
      return (
        <View
          style={{
            paddingTop: StatusBar.currentHeight,
            backgroundColor: COLORS.primary
          }}
        />
      )
    }

    return null;
  }

  render() {
    let { statusBarColor, isReady, showNav, topics } = this.state;

    if (!isReady) {
      return (
        <View style={{flex:1, justifyContent: "center", alignItems: "center"}}>
          {this.renderTopBarSpacer()}
          <Spinner color={COLORS.primary} />
        </View>
      );
    }

    const header = (
      <Header style={styles.header}>
        <Body style={styles.headerBody}>
          <Icon
            name="book"
            size={20}
            color="#D1C4E9"
            style={styles.headerIcon}
          />
          <Title style={styles.headerTitle}>Book Search</Title>
        </Body>
      </Header>
    );

    const SearchComponent = (
      <View style={styles.searchBooksContainer}>
        <DataSearch
          componentId="SearchText"
          dataField={[
            "original_title",
            "original_title.search",
            "authors",
            "authors.search"
          ]}
          debounce={300}
          autosuggest={false}
          placeholder="🔍  Search for a book title or an author"
        />
      </View>
    );

    return (
      <ReactiveBase
        app={APPBASE_CONFIG.app}
        credentials={APPBASE_CONFIG.credentials}
        type={APPBASE_CONFIG.type}
      >
        {this.renderTopBarSpacer()}
        {header}
        <DataController
          componentId="showAll"
          visible={false}
          customQuery={function(value) {
            return {
              match_all: {}
            };
          }}
        />
        {SearchComponent}
        <ScrollView>
          <View style={[styles.container, styles.column]}>
            <View
              style={[styles.fullWidth, styles.alignCenter, styles.results]}
            >
              <ReactiveList
                componentId="ReactiveList"
                dataField="original_title"
                size={10}
                onAllData={this.onAllData}
                pagination
                paginationAt="bottom"
                react={{
                  and: ["showAll", "SearchText"]
                }}
                showResultStats={false}
              />
            </View>
          </View>
        </ScrollView>
      </ReactiveBase>
    );
  }
}
