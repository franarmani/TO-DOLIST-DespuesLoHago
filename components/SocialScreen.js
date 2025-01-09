import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const SocialScreen = ({ onClose, theme }) => {
  const socialLinks = [
    {
      name: 'Instagram',
      icon: 'camera',
      url: 'https://www.instagram.com/fran.armani_/',
      color: theme.social.instagram
    },
    {
      name: 'LinkedIn',
      icon: 'work',
      url: 'https://www.linkedin.com/in/franarmanidev/',
      color: theme.social.linkedin
    },
    {
      name: 'GitHub',
      icon: 'code',
      url: 'https://github.com/franarmani',
      color: theme.name === 'dark' ? '#333333' : theme.social.github
    },
    {
      name: 'Portfolio',
      icon: 'brush',
      url: 'https://samuraidesigns.framer.ai',
      color: theme.social.portfolio
    }
  ];

  const openLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.text }]}>Contáctame</Text>
          <MaterialIcons name="workspace-premium" size={24} color={theme.social.portfolio} style={styles.crownIcon} />
        </View>
        <TouchableOpacity 
          onPress={onClose} 
          style={[styles.closeButton, { backgroundColor: theme.surface }]}
        >
          <MaterialIcons name="close" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {socialLinks.map((link, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.socialButton,
              { 
                backgroundColor: theme.surface,
                borderColor: theme.border,
                shadowColor: link.color,
              }
            ]}
            onPress={() => openLink(link.url)}
          >
            <View style={[styles.iconContainer, { backgroundColor: link.color }]}>
              <MaterialIcons name={link.icon} size={24} color="#fff" />
            </View>
            <Text style={[styles.socialText, { color: theme.text }]}>
              {link.name}
            </Text>
            <MaterialIcons
              name="arrow-forward-ios"
              size={16}
              color={theme.textSecondary}
            />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footerContainer}>
        <MaterialIcons name="favorite" size={16} color={theme.social.instagram} />
        <Text style={[styles.footer, { color: theme.textSecondary }]}>
          {' '}Desarrollado por Franco Armani
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    paddingTop: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  crownIcon: {
    marginLeft: 8,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    gap: 16,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '600',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  footer: {
    fontSize: 14,
  },
});

export default SocialScreen; 