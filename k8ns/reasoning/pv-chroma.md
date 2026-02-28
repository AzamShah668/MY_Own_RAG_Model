# pv-chroma.yaml Reasoning

This file defines a **PersistentVolume (PV)**, which represents the physical storage on your host machine.

- **Line 1-2: `apiVersion: v1`, `kind: PersistentVolume`**: Tells Kubernetes we are defining a piece of physical storage.
- **Line 4: `name: pv-chroma`**: The unique name for this storage piece.
- **Line 7: `storage: 1Gi`**: Allocates 1 Gigabyte of space for the database.
- **Line 9: `ReadWriteOnce`**: Allows the volume to be mounted as read-write by a single pod.
- **Line 10: `persistentVolumeReclaimPolicy: Retain`**: **CRITICAL FOR SAFETY**. This ensures that even if you delete the Kubernetes "Claim" (the PVC), the data on your D: drive remains untouched.
- **Line 12: `hostPath`**: Maps the storage directly to your Windows filesystem.
- **Line 13: `path: /run/desktop/mnt/host/d/rag-data/chroma_db`**: This is how Kubernetes (running inside WSL2) sees your `D:\rag-data\chroma_db` folder.
- **Line 14: `type: DirectoryOrCreate`**: Tells Kubernetes to use the directory if it exists, or create it if it doesn't.
