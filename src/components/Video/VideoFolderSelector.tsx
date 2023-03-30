import { useState, useEffect } from 'react';

import { Box, Dialog, Button, DialogActions, Slide } from '@mui/material';

import {
  FileBrowser,
  FileList,
  FileArray,
  ChonkyActions,
  FileData,
  FileNavbar,
} from '@aperturerobotics/chonky';

import * as api from '@/api';

type VideoFolderSelectorProps = {
  open: boolean;
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
};

export default function VideoFolderSelector({
  open,
  value,
  onChange,
  onClose,
}: VideoFolderSelectorProps) {
  const [files, setFiles] = useState<FileArray>([]);
  const [folderChain, setFolderChain] = useState<FileArray>([]);

  useEffect(() => {
    if (!open || !value) return;
    (async () => {
      const data = await api.postVideoOpen(value);
      setFiles(data.files);
      setFolderChain(data.folderChain);
    })();
  }, [value, open]);

  const handleChange = () => {
    const path = folderChain[folderChain.length - 1]?.id;
    if (!path) return;
    onChange(path);
    onClose();
  };

  return (
    <Dialog
      open={open}
      maxWidth="xl"
      onClose={onClose}
      TransitionComponent={Slide}
    >
      <Box width={500} height={500}>
        <FileBrowser
          disableDragAndDropProvider
          files={files}
          folderChain={folderChain}
          onFileAction={async (fileActionData) => {
            const {
              action: { id },
              payload,
            } = fileActionData;
            if (id === ChonkyActions.OpenFiles.id) {
              const openPayload = payload as { files: FileData[] };
              const data = await api.postVideoOpen(openPayload.files[0].id);
              setFiles(data.files);
              setFolderChain(data.folderChain);
            }
          }}
        >
          <FileNavbar />
          <FileList />
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={handleChange}>Confirm</Button>
          </DialogActions>
        </FileBrowser>
      </Box>
    </Dialog>
  );
}
