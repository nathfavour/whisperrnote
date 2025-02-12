"use client";

import { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Popper, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Typography,
  InputAdornment,
  Chip,
  Divider,
  IconButton
} from '@mui/material';
import { 
  Search, 
  NoteOutlined, 
  FolderOutlined, 
  LocalOfferOutlined,
  Close,
  AccessTime 
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import debounce from 'lodash/debounce';

type SearchResult = {
  id: string;
  type: 'note' | 'collection' | 'tag';
  title: string;
  excerpt?: string;
  date?: string;
  tags?: string[];
};

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const handleSearch = debounce(async (term: string) => {
    if (!term) {
      setResults([]);
      return;
    }
    
    // TODO: Implement actual search API call
    const mockResults: SearchResult[] = [
      {
        id: '1',
        type: 'note',
        title: 'Project Meeting Notes',
        excerpt: 'Discussion about the new feature implementation...',
        date: '2 days ago',
        tags: ['work', 'meeting']
      },
      {
        id: '2',
        type: 'collection',
        title: 'Work Documents',
        date: 'Yesterday'
      },
      {
        id: '3',
        type: 'tag',
        title: 'important'
      }
    ];
    
    setResults(mockResults);
  }, 300);

  const getIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'note':
        return <NoteOutlined />;
      case 'collection':
        return <FolderOutlined />;
      case 'tag':
        return <LocalOfferOutlined />;
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setResults([]);
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', maxWidth: 600, mx: 'auto' }}>
      <TextField
        fullWidth
        placeholder="Search notes, collections, and tags..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          handleSearch(e.target.value);
        }}
        onFocus={() => setIsOpen(true)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={clearSearch}>
                <Close />
              </IconButton>
            </InputAdornment>
          )
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            backgroundColor: 'background.paper',
            transition: 'all 0.2s',
            '&.Mui-focused': {
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }
          }
        }}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 1000,
              marginTop: '8px'
            }}
          >
            <Paper 
              elevation={4}
              sx={{ 
                maxHeight: 400,
                overflow: 'auto',
                borderRadius: 2
              }}
            >
              {!searchTerm && recentSearches.length > 0 && (
                <>
                  <Box sx={{ p: 2, pb: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Recent Searches
                    </Typography>
                  </Box>
                  <List dense>
                    {recentSearches.map((term, index) => (
                      <ListItem 
                        key={index}
                        button
                        onClick={() => setSearchTerm(term)}
                      >
                        <ListItemIcon>
                          <AccessTime fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={term} />
                      </ListItem>
                    ))}
                  </List>
                  <Divider />
                </>
              )}

              {results.length > 0 ? (
                <List>
                  {results.map((result) => (
                    <ListItem 
                      key={result.id}
                      button
                      sx={{ py: 1.5 }}
                    >
                      <ListItemIcon>
                        {getIcon(result.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={result.title}
                        secondary={
                          result.excerpt && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}
                            >
                              {result.excerpt}
                            </Typography>
                          )
                        }
                      />
                      <Box sx={{ ml: 2, textAlign: 'right' }}>
                        {result.date && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            {result.date}
                          </Typography>
                        )}
                        {result.tags && (
                          <Box sx={{ mt: 1 }}>
                            {result.tags.map(tag => (
                              <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                sx={{ mr: 0.5 }}
                              />
                            ))}
                          </Box>
                        )}
                      </Box>
                    </ListItem>
                  ))}
                </List>
              ) : searchTerm && (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography color="text.secondary">
                    No results found for "{searchTerm}"
                  </Typography>
                </Box>
              )}
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}