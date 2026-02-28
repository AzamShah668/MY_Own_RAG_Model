# Reasoning: frontend-deployment.yaml

This file defines the **Deployment** for the RAG Frontend.

```yaml
1: apiVersion: apps/v1
2: kind: Deployment
3: metadata:
4:   name: frontend-deployment
5:   namespace: rag-model
...
22:       containers:
23:       - name: frontend
24:         image: azamshah/rag-frontend:latest
25:         imagePullPolicy: IfNotPresent
26:         ports:
27:         - containerPort: 3000
28:         env:
29:         - name: NEXT_PUBLIC_API_URL
30:           valueFrom:
31:             configMapKeyRef:
32:               name: rag-config
33:               key: NEXT_PUBLIC_API_URL
```

## Line-by-Line Explanation

- **Line 1-5**: Standard metadata for the deployment named `frontend-deployment`.
- **Line 11: `replicas: 1`**: Ensures one instance of the frontend is always running.
- **Line 24: `image: azamshah/rag-frontend:latest`**: The Docker image for the Next.js frontend.
- **Line 27: `containerPort: 3000`**: The frontend app listens on port 3000.
- **Line 29-33: `env`**: We inject the `NEXT_PUBLIC_API_URL` environment variable from our **ConfigMap**.
- **Line 32: `name: rag-config`**: Matches the name of the ConfigMap we created earlier.
- **Line 33: `key: NEXT_PUBLIC_API_URL`**: Matches the key inside the ConfigMap which points to Google's backend service.

## Why this is important
This deployment ensures the frontend is correctly configured to talk to the backend within the Kubernetes cluster. By fetching the API URL from a ConfigMap, we can easily point the frontend to a different backend (e.g., a staging backend) simply by updating the ConfigMap, without touching the deployment or the code.
