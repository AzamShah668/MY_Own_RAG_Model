# pv-models.yaml Reasoning

This file defines the physical storage for your AI model cache on your Windows D: drive.

- **Line 4: `name: pv-models`**: Unique name for the model storage.
- **Line 7: `storage: 2Gi`**: Allocates 2 Gigabytes for AI models (which can be large).
- **Line 13: `path: /run/desktop/mnt/host/d/rag-data/models`**: Maps to `D:\rag-data\models` on your Windows machine.
- **Why use this?**: This ensures that once the 500MB+ AI model is downloaded, it stays on your physical hard drive. Even if you reset Docker or reinstall the app, you won't have to wait for the download again.
