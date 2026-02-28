# Reasoning: pvc.yaml

This file defines a **PersistentVolumeClaim (PVC)**. This is how we request permanent storage from the Kubernetes cluster to ensure data is not lost when pods are restarted.

```yaml
1: apiVersion: v1
2: kind: PersistentVolumeClaim
3: metadata:
4:   name: chroma-pvc
5:   namespace: rag-model
6: spec:
7:   accessModes:
8:     - ReadWriteOnce
9:   resources:
10:    requests:
11:      storage: 1Gi
```

## Line-by-Line Explanation

- **Line 1: `apiVersion: v1`**: The API version for core Kubernetes objects.
- **Line 2: `kind: PersistentVolumeClaim`**: Specifies we are requesting storage.
- **Line 3: `metadata:`**: Metadata section.
- **Line 4: `name: chroma-pvc`**: The name of our database storage claim. 
- **model-cache-pvc (New)**: I have also added a second PVC named `model-cache-pvc` which stores the AI model weights.
- **Line 5: `namespace: rag-model`**: Ensures the storage claim is in the correct namespace.
- **Line 7: `storageClassName: manual`**: Tells Kubernetes NOT to use the default internal storage, but to wait for us to provide a manual volume.
- **Line 8: `volumeName: pv-chroma`**: Specifically links this claim to the physical folder on your D: drive defined in `pv-chroma.yaml`.
- **Line 8: `- ReadWriteOnce`**: This means the volume can be mounted as read-write by a single node at a time. This is perfect for a database like ChromaDB.
- **Line 9: `resources:`**: Specifies the requested resource amounts.
- **Line 10: `requests:`**: The minimum amount of resources we need.
- **Line 11: `storage: 1Gi`**: We are requesting 1 Gigabyte of storage.

## Why this is important
By default, data inside a container is ephemeral (temporary). If a pod is deleted or crashes, any data saved inside it is gone. In a **production-level** set up, we use PVCs to tell Kubernetes: "I need 1GB of storage that should survive even if my pod dies." Kubernetes will find a volume and attach it to our pod whenever it runs.
