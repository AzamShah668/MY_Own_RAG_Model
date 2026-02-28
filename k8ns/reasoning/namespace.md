# Reasoning: namespace.yaml

This file defines the **Namespace** in which all our resources will reside.

```yaml
1: apiVersion: v1
2: kind: Namespace
3: metadata:
4:   name: rag-model
5:   labels:
6:     app: rag-app
```

## Line-by-Line Explanation

- **Line 1: `apiVersion: v1`**: Specifies the version of the Kubernetes API to use. `v1` is the standard version for basic resources like Namespaces.
- **Line 2: `kind: Namespace`**: Tells Kubernetes that we are creating a `Namespace` object. Namespaces provide a way to isolate groups of resources within a single cluster.
- **Line 3: `metadata:`**: This section contains data that helps uniquely identify the object.
- **Line 4: `name: rag-model`**: Assigns the name `rag-model` to this namespace. All our other resources (Pods, Services, etc.) will be created inside this namespace.
- **Line 5: `labels:`**: Labels are key/value pairs that are attached to objects.
- **Line 6: `app: rag-app`**: Adds a label `app=rag-app` to the namespace. This is useful for filtering or grouping resources later.

## Why this is important
Isolation is a key part of production-level structures. By using a dedicated namespace like `rag-model`, we ensure that our application doesn't interfere with other projects running in the same Kubernetes cluster.
