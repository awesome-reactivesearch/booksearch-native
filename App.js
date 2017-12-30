import Expo from "expo";
import React from "react";
import {
  View,
  ScrollView,
  FlatList,
  Platform,
  Dimensions,
  Image,
  StyleSheet,
  StatusBar
} from "react-native";
import {
  Text,
  Header,
  Title,
  Content,
  Card,
  CardItem,
  Body,
  Left,
  Right,
  Thumbnail,
  Button
} from "native-base";

import {
  ReactiveBase,
  DataController,
  TextField,
  ReactiveList
} from "@appbaseio/reactivebase-native";

import Icon from "react-native-vector-icons/FontAwesome";

{
  /* <ReactiveList
    dataField="title"
    componentId="BooksList"
    onData={res => this.onData(res)}
    pagination
    react={{
      or: ["SearchText", "ShowAll"]
    }}
  /> */
}

// var { height, width } = Dimensions.get("window");
// if (Platform.OS === "android") {
//   height = height - StatusBar.currentHeight;
// }

const COLORS = {
  primary: "#673AB7",
  secondary: "#D1C4E9",
  seperator: "#EEEEEE"
};

const s = StyleSheet.create({
  flex: {
    flex: 1
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
    paddingTop: 3
  },
  headerBody: {
    flex: 1,
    flexDirection: "row"
  },
  headerTitle: {
    color: COLORS.secondary
  },
  searchBooksContainer: {
    backgroundColor: "#ECEFF1",
    marginHorizontal: 10
  },
  padding5: {
    padding: 5
  },
  booksContainer: {
    flex: 1,
    backgroundColor: "white"
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
    paddingLeft: 5
  }
});

export default class App extends React.Component {
  state = {
    isReady: false
  };

  async componentWillMount() {
    // @expo: fonts load

    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("native-base/Fonts/Ionicons.ttf")
    });

    this.setState({ isReady: true });
  }

  onData = data => {
    console.log("onData:", data);
    return <Text>{data.title}</Text>;
  };

  render() {
    const StatusBarSeperator = (
      // @expo: android only - status bar spacing fix
      <View
        style={{
          paddingTop:
            Platform.OS === "android"
              ? Expo ? (Expo.Constants ? Expo.Constants.statusBarHeight : 0) : 0
              : 0,
          backgroundColor: COLORS.primary
        }}
      />
    );

    const topBar = (
      <View>
        {StatusBarSeperator}
        <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      </View>
    );

    const header = (
      <Header style={s.header}>
        <Body style={s.headerBody}>
          <Icon name="book" size={20} color="#D1C4E9" style={s.headerIcon} />
          <Title style={s.headerTitle}>Good Books</Title>
        </Body>
      </Header>
    );

    const SearchComponent = (
      <View style={s.searchBooksContainer}>
        <TextField
          componentId="SearchText"
          dataField="title"
          placeholder="Search books"
        />
      </View>
    );

    const MatchAllPseudoComponent = (
      <DataController
        componentId="ShowAll"
        visible={false}
        customQuery={value => {
          return {
            match_all: {}
          };
        }}
      />
    );


    // @expo: fonts loading isReady state
    if (!this.state.isReady) {
      return <Text>Loading...</Text>;
    }

    return (
      <View style={s.flex}>
        {topBar}
        <View style={s.flex}>
          {header}
          <ScrollView style={s.flex}>
            <ReactiveBase
              app="books-native"
              credentials="2WQ5N6vmf:7cc1218e-464b-49a0-9e5a-8dbc720cc543"
              type="good-books-live"
            >
              <View style={s.padding5} />
              {SearchComponent}
              {MatchAllPseudoComponent}
              <Content style={s.booksContainer}>
                {BookRow}
              </Content>
            </ReactiveBase>
          </ScrollView>
        </View>
      </View>
    );
  }
}
