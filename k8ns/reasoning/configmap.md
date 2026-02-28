# Reasoning: configmap.yaml

This file defines a **ConfigMap** to store non-sensitive configuration settings as key-value pairs.

```yaml
1: apiVersion: v1
2: kind: ConfigMap
3: metadata:
4:   name: rag-config
5:   namespace: rag-model
6: data:
7:   GROQ_MODEL: llama-3.1-8b-instant
8:   COLLECTION_NAME: rag_collection
9:   NEXT_PUBLIC_API_URL: http://backend-service:8001
10:  CHROMA_DB_PATH: /app/data/chroma_db
```

## Line-by-Line Explanation

- **Line 1: `apiVersion: v1`**: The API version for basic Kubernetes resources including ConfigMaps.
- **Line 2: `kind: ConfigMap`**: Specifies that this object is a `ConfigMap`.
- **Line 3: `metadata:`**: Metadata section.
- **Line 4: `name: rag-config`**: The name of the ConfigMap.
- **Line 5: `namespace: rag-model`**: Ensures the ConfigMap is in the correct namespace.
- **Line 6: `data:`**: This is where the configuration keys and values are defined.
- **Line 7: `GROQ_MODEL: llama-3.1-8b-instant`**: Specifies the AI model to use.
- **Line 8: `COLLECTION_NAME: rag_collection`**: Specifies the name of the vector database collection.
- **Line 9: `NEXT_PUBLIC_API_URL: http://backend-service:8001`**: The URL used by the frontend to talk to the backend. In Kubernetes, we use the service name (`backend-service`) instead of `localhost` or `backend`.
- **Line 10: `CHROMA_DB_PATH: /app/data/chroma_db`**: The path inside the container where the database will be stored.

## Why this is important
ConfigMaps allow you to separate configuration from application code. This makes it easy to change settings (like the model name or API URL) without rebuilding your container images. It also makes the deployment more portable across different environments.
