// Task.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Task = ({ text, isCompleted }) => {
    return (
        <View style={styles.taskWrapper}>
            <View style={styles.taskContent}>
                {isCompleted && <Text style={styles.checkmark}>✔</Text>} {/* Mostrar el check si está completada */}
                <Text style={[styles.taskText, isCompleted && styles.completed]}>{text}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    taskWrapper: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    taskContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    taskText: {
        fontSize: 16,
        color: 'black',
    },
    completed: {
        textDecorationLine: 'line-through',
        color: '#888',
    },
    checkmark: {
        fontSize: 20,
        marginRight: 10,
        color: '#55BCF6',
    },
});

export default Task;
