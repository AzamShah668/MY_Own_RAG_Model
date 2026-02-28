# Reasoning: deploy.ps1

This is an automation script to ensure all Kubernetes components are applied in the correct logical order.

```powershell
1:  echo "Applying Namespace..."
2:  kubectl apply -f namespace.yaml
...
4:  echo "Applying Secret..."
5:  kubectl apply -f secret.yaml
...
10: echo "Applying Persistence (PVC)..."
11: kubectl apply -f pvc.yaml
...
22: kubectl get all -n rag-model
```

## Line-by-Line Explanation

- **Lines 1-2**: Creates the `rag-model` namespace first. All subsequent resources depend on this namespace existing.
- **Lines 4-8**: Applies the configuration (Secret and ConfigMap). These must be created before the pods start, so the pods can fetch their environment variables.
- **Lines 10-11**: Requests the storage (PVC). The backend deployment needs this to be ready so it can mount it.
- **Lines 13-17**: Deploys the Backend and its Service.
- **Lines 19-23**: Deploys the Frontend and its Service.
- **Line 26: `kubectl get all -n rag-model`**: Once everything is applied, this command gives you an overview of the status of all pods, services, and deployments in the namespace.

## Why this is important
Complexity increases when you have many moving parts (PVs, Secrets, Deployments, Services). A deployment script reduces the risk of human error and ensures that the infrastructure comes up in the right order. This is a core practice in **Infrastructure as Code (IaC)**.
