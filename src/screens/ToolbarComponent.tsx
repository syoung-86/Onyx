import React, { useEffect, useState } from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import { markdownStyles, styles } from '../styles';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

export const MarkdownToolbar = ({ onInsert }) => (
  <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', padding: 10, backgroundColor: '#eee' }}>
    <TouchableWithoutFeedback onPress={() => onInsert('**', '**')}>
      <Text>Bold</Text>
    </TouchableWithoutFeedback>
    <TouchableWithoutFeedback onPress={() => onInsert('*', '*')}>
      <Text>Italic</Text>
    </TouchableWithoutFeedback>
    <TouchableWithoutFeedback onPress={() => onInsert('# ', '')}>
      <Text>H1</Text>
    </TouchableWithoutFeedback>
    <TouchableWithoutFeedback onPress={() => onInsert('## ', '')}>
      <Text>H2</Text>
    </TouchableWithoutFeedback>
    <TouchableWithoutFeedback onPress={() => onInsert('\n---\n', '')}>
      <Text>Horizontal Rule</Text>
    </TouchableWithoutFeedback>
    <TouchableWithoutFeedback onPress={() => onInsert('~~', '~~')}>
      <Text>Strikethrough</Text>
    </TouchableWithoutFeedback>
    <TouchableWithoutFeedback onPress={() => onInsert('> ', '')}>
      <Text>Block Quote</Text>
    </TouchableWithoutFeedback>
    <TouchableWithoutFeedback onPress={() => onInsert('+ ', '')}>
      <Text>List (Unordered)</Text>
    </TouchableWithoutFeedback>
    <TouchableWithoutFeedback onPress={() => onInsert('1. ', '')}>
      <Text>List (Ordered)</Text>
    </TouchableWithoutFeedback>
    <TouchableWithoutFeedback onPress={() => onInsert('```\n', '\n```')}>
      <Text>Code Block</Text>
    </TouchableWithoutFeedback>
    <TouchableWithoutFeedback onPress={() => onInsert('[Link Text](https://www.google.com)', '')}>
      <Text>Link</Text>
    </TouchableWithoutFeedback>
    <TouchableWithoutFeedback onPress={() => onInsert('![Image](https://octodex.github.com/images/minion.png)', '')}>
      <Text>Image</Text>
    </TouchableWithoutFeedback>

                            <TouchableOpacity onPress={saveNotes} style={styles.contentContainer}>
                                <Text style={styles.buttonText}>
                                    Save Notes
                                </Text>
                            </TouchableOpacity>
  </View>
);

export default MarkdownToolbar;
