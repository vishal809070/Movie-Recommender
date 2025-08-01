import React from 'react';
import { Modal, Box } from '@mui/material';

const TrailerModal = ({ open, onClose, videoKey }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%', height: '60vh',
        bgcolor: 'black',
        boxShadow: 24,
        p: 1
      }}>
        {videoKey ? (
          <iframe
            width="100%" height="100%"
            src={`https://www.youtube.com/embed/${videoKey}`}
            title="YouTube Trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <p style={{ color: 'white', textAlign: 'center' }}>No trailer found</p>
        )}
      </Box>
    </Modal>
  );
};

export default TrailerModal;
