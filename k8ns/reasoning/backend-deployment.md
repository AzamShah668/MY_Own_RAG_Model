# Reasoning: backend-deployment.yaml

This file defines the **Deployment** for the RAG Backend. A deployment manages the lifecycle of your pods, ensuring the requested number of instances are running.

```yaml
1: apiVersion: apps/v1
2: kind: Deployment
3: metadata:
4:   name: backend-deployment
5:   namespace: rag-model
...
10: spec:
11:   replicas: 1
12:   selector:
13:     matchLabels:
14:       app: backend
15:   template:
...
22:       containers:
23:       - name: backend
24:         image: azamshah/rag-backend:latest
...
28:         env:
29:         - name: GROQ_API_KEY
30:           valueFrom:
31:             secretKeyRef:
...
```

## Line-by-Line Explanation

- **Line 1: `apiVersion: apps/v1`**: The version for application management resources like Deployments.
- **Line 2: `kind: Deployment`**: Specifies we are creating a Deployment.
- **Line 4: `name: backend-deployment`**: The name of our deployment.
- **Line 11: `replicas: 1`**: Specifies how many copies of the pod we want.
- **Line 12-14: `selector`**: Tells the deployment which pods it manages based on labels.
- **Line 15-20: `template`**: The blueprint for creating new pods.
- **Line 24: `image: azamshah/rag-backend:latest`**: The Docker image to use for the container.
- **Line 28-50: `env`**: Pulls values from Secret and ConfigMap.
- **Line 47-56: `resources`**: Sets CPU and Memory requests/limits. This is critical for performance; it ensures the backend has enough power to process PDFs and prevents it from being throttled by other processes.
- **Line 57-72: `readinessProbe` & `livenessProbe`**: Ensures the pod is fully ready before receiving traffic and automatically restarts if it crashes.
- **Line 73-75: `volumeMounts`**: Mounts the PVC storage.
- **Line 75: `mountPath: /app/data`**: Path inside the container for persistence.
- **Line 76-79: `volumes`**: Links to `chroma-pvc`.

## Why this is important
This file is the "brain" of our backend service. It ensures that if the pod is deleted, Kubernetes will automatically start a new one, re-attach the storage (`chroma-pvc`), and inject all the necessary environment variables from our Secrets and ConfigMaps. This makes the system resilient and "stateless" in terms of pod lifecycle while maintaining persistent data.
