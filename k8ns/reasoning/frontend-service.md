# Reasoning: frontend-service.yaml

This file defines a **Service** for the frontend, exposing the web interface to your host machine.

```yaml
1: apiVersion: v1
2: kind: Service
3: metadata:
4:   name: frontend-service
5:   namespace: rag-model
6: spec:
7:   type: LoadBalancer
8:   selector:
9:     app: frontend
10:  ports:
11:    - protocol: TCP
12:      port: 3000
13:      targetPort: 3000
```

## Line-by-Line Explanation

- **Line 1-5**: Metadata naming the service `frontend-service` in the `rag-model` namespace.
- **Line 7: `type: LoadBalancer`**: This is the "magic" line for local development. On Docker Desktop, this tells Kubernetes to take the internal port 3000 and map it to `localhost:3000` on your Windows machine.
- **Line 8-9: `selector`**: Connects this service to any pod with the label `app: frontend`.
- **Line 10-13: `ports`**: Configures the port mapping. 
- **Line 12: `port: 3000`**: The port you will use in your browser.
- **Line 13: `targetPort: 3000`**: The port the container is listening on.

## Why this is important
Without a service, you wouldn't be able to access the frontend from your browser. The service provides a stable entry point. Even if Kubernetes decides to move the frontend pod to a different internal IP address, the Service remains at `localhost:3000`, ensuring you always have access to the UI.
