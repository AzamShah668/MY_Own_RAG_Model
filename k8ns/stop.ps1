# Kubernetes Cleanup Script for RAG Model
# This script removes all resources in the rag-model namespace.

echo "Deleting all resources in rag-model namespace..."
kubectl delete all --all -n rag-model

echo "Deleting ConfigMaps and Secrets..."
kubectl delete configmap rag-config -n rag-model
kubectl delete secret rag-secrets -n rag-model

echo "Deleting Persistence (PVC)..."
# Note: The data stays on the host if using hostpath, but the claim is removed.
kubectl delete pvc chroma-pvc -n rag-model

echo "Deleting Namespace (Optional, but ensures clean state)..."
kubectl delete namespace rag-model

echo "Stop/Cleanup complete!"
