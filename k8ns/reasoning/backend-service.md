# Reasoning: backend-service.yaml

This file defines a **Service** for the backend. Services provide a stable IP address and DNS name for our pods, which otherwise have changing IP addresses.

```yaml
1: apiVersion: v1
2: kind: Service
3: metadata:
4:   name: backend-service
5:   namespace: rag-model
6: spec:
7:   type: LoadBalancer
8:   selector:
9:     app: backend
10:  ports:
11:    - protocol: TCP
12:      port: 8001
13:      targetPort: 8001
```

## Line-by-Line Explanation

- **Line 1-5**: Basic metadata, naming the service `backend-service` in the `rag-model` namespace.
- **Line 7: `type: LoadBalancer`**: On Docker Desktop, this exposes the service on your local machine's port. This allows you to access the backend API from your browser or tools like Postman outside of Kubernetes.
- **Line 8-9: `selector`**: This is critical. It tells the service to send traffic to any pod that has the label `app: backend`. This is how it connects the Service to the Deployment.
- **Line 10-13: `ports`**: Defines how traffic flows.
- **Line 12: `port: 8001`**: The port the service will listen on (and expose on your host).
- **Line 13: `targetPort: 8001`**: The port the application is actually listening on inside the container.

## Why this is important
Pods are temporary. They can be killed and restarted at any time, and when they do, they get new IP addresses. The **Service** acts as a fixed gateway. The frontend will always talk to `http://backend-service:8001`, and the Service will handle the job of finding the correct backend pod, even if it just restarted.
