import React from 'react'
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, KeyboardAvoidingView, TextInput, Keyboard, Animated} from 'react-native'
import {AntDesign, Ionicons} from '@expo/vector-icons';
import col from '../Colors';

import {Swipeable} from 'react-native-gesture-handler';

export default class TodoModal extends React.Component {

  state = {
    newTodo: ""
  };

  toggleTodoCompleted = index => {
    let list = this.props.list;
    list.todos[index].completed = !list.todos[index].completed;

    this.props.updateList(list);
  }

  addTodo = () => {
    let list = this.props.list;

    if(!list.todos.some(todo => todo.title === this.state.newTodo)){
      list.todos.push({title: this.state.newTodo, completed: false});

      this.props.updateList(list);
    }
    list.todos.push({title: this.state.newTodo, completed: false});


    this.props.updateList(list);
    this.setState({newTodo:""});

    Keyboard.dismiss();
  };

  deleteTodo = (index) => {
    let list = this.props.list;
    list.todos.splice(index,1);

    this.props.updateList(list);
  };

  renderTodo = (todo,index) => {
      return (
        <Swipeable renderRightActions={(_,dragX) => this.rightActions(dragX,index)}>
        <View style={styles.todoContainer}>
          <TouchableOpacity onPress={() => this.toggleTodoCompleted(index)}>
            <Ionicons name={todo.completed ? 'ios-square' : 'ios-square-outline' } size={24} color={col.gray} style={{width: 32}} />

          </TouchableOpacity>
          <Text style={[styles.todo, {textDecorationLine: todo.completed ? 'line-through' : 'none', color: todo.completed ? col.gray : col.black}]}>{todo.title}</Text>
        </View>
        </Swipeable>
      );
  };

  rightActions = (dragX, index) => {

    const scale = dragX.interpolate({
      inputRange: [-100,0],
      outputRange: [1,0.9],
      extrapolate: "clamp"
  });

  const opacity = dragX.interpolate({
    inputRange: [-100,-20,0],
    outputRange: [1,0.9,0],
    extrapolate: "clamp"
  });

    return (
      <TouchableOpacity onPress={() => this.deleteTodo(index)}>
        <Animated.View style={[styles.deleteButton, {opacity: opacity}]}>
          <Animated.Text style={{color: col.white, fontWeight: "800", transform: [{scale}]}}>
            Delete
          </Animated.Text>
        </Animated.View>
      </TouchableOpacity>
    );
  }
  render() {
    const list = this.props.list;


    const taskCOunt = list.todos.length;
    const completedCount = list.todos.filter(todo => todo.completed).length;

    return (
      <KeyboardAvoidingView style={{flex:1}} behavior="padding">
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={{position: 'absolute', top: 64, right: 32, zIndex: 10}} onPress={ this.props.closeModal}>
            <AntDesign name="close" size={24} color={col.black} />
        </TouchableOpacity>

        <View style={[styles.section, styles.header, {borderBottomColor: list.color}]}>
          <View>
              <Text style={styles.title}>{list.name} </Text>
              <Text style={styles.taskCount}>{completedCount} of {taskCOunt} </Text>
              
          </View>
        </View>
        <View style={[styles.section, {flex: 3, marginVertical: 16}]}>
          <FlatList data={list.todos} renderItem={({item,index}) => this.renderTodo(item, index)} keyExtractor={(item) => item.title}  showsVerticalScrollIndicator={false} />
        </View>
        <View style={[styles.section, styles.footer]}>
            <TextInput style={[styles.input, {borderColor: list.color}]} onChangeText={text => this.setState({newTodo: text})} value={this.state.newTodo} />
            
            <TouchableOpacity style={[styles.addTodo, {backgroundColor: list.color}]} onPress={() => this.addTodo()}>
              <AntDesign name="plus" size={16} color={col.white} />
            </TouchableOpacity>
        </View>
      </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  section: {
      
      alignSelf: "stretch"
  },
  header: {
    justifyContent: "flex-end",
    marginLeft: 64,
    borderBottomWidth: 3,
    paddingTop: 16
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: col.black
  },
  taskCount: {
    marginTop: 4,
    marginBottom: 16,
    color: col.gray,
    fontWeight: "600"
  },
  footer: {
    paddingHorizontal: 32,
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 16
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 6,
    marginRight: 8,
    paddingHorizontal: 8
  },
  addTodo: {
    borderRadius: 4,
    padding: 16,
    alignItems: "center",
    justifyContent: "center"
  },
  todoContainer: {
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 32
  },
  todo: {
    color: col.black,
    fontWeight: "700",
    fontSize: 16
  },
  deleteButton: {
    flex: 1,
    backgroundColor: col.red,
    justifyContent: "center",
    alignItems: "center",
    width: 80
  }

});


