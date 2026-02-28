# Reasoning: stop.ps1

This script provides a clean way to "stop" the application by removing its resources from the cluster.

```powershell
1:  echo "Deleting all resources in rag-model namespace..."
2:  kubectl delete all --all -n rag-model
...
13: kubectl delete namespace rag-model
```

## Line-by-Line Explanation

- **Line 2: `kubectl delete all --all -n rag-model`**: Deletes Deployments, Services, and Pods.
- **Lines 5-6**: Removes the configuration and sensitive data from the cluster.
- **Line 10: `kubectl delete pvc chroma-pvc`**: Removes the claim for storage. 
- **Line 13: `kubectl delete namespace rag-model`**: Deleting the namespace is the ultimate "stop" command as it cleans up everything inside it in one go.

## Why this is important
A production-level workflow includes a way to tear down infrastructure as easily as it is built. This script ensures that no orphaned resources are left consuming memory or CPU on your cluster when you want to stop the application.
