---
title: "Kubernetes 入门实战教程：kind 版"
description: "面向 Windows、WSL 2 和 Docker Desktop 环境的 Kubernetes 入门实战教程，从 kind 集群开始理解 Pod、Deployment、Service 和常见工作流。"
date: 2026-06-11 00:00:00 +0800
slug: kind-k8s-learning-guide
tags:
  - Kubernetes
  - kind
  - 云原生
---

适用环境：

- Windows 10/11
- WSL 2 Ubuntu
- Docker Desktop
- 在 WSL 终端里执行命令

这份教程不是命令清单，而是按下面这个顺序展开：

1. 你要做什么
2. 为什么这样做
3. 它在 Kubernetes 里解决什么问题
4. 做完之后你应该理解什么

你学 Kubernetes 不能只会敲命令。每个命令背后都有“为什么存在”。如果这个问题不讲清楚，后面学 Helm、Ingress、StatefulSet、RBAC 都会变成背语法。

---

## 0. 先建立一个正确的学习框架

很多人一开始学 Kubernetes，会陷入两个误区：

第一种误区是只记概念，比如记住 `Pod`、`Deployment`、`Service` 这些名词，但不知道它们为什么存在。

第二种误区是只会抄命令，比如会执行：

```bash
kubectl create deployment nginx --image=...
```

但是不知道这条命令到底改变了什么。

Kubernetes 其实是在解决一个很实际的问题：

```text
如果我有很多应用容器要长期运行，
我要怎么保证它们能自动启动、自动恢复、稳定访问、平滑升级？
```

Docker 解决的是：

```text
怎么运行一个容器
```

Kubernetes 解决的是：

```text
怎么长期管理很多容器组成的系统
```

所以你可以把它们的关系理解成：

```text
Docker 更像“运行单个容器的引擎”
Kubernetes 更像“管理容器集群的操作系统”
```

这就是你学它的意义。

---

## 1. 你现在这套环境到底是什么

你的环境是：

```text
Windows
  -> Docker Desktop
  -> WSL 2 Ubuntu
  -> kind
  -> Kubernetes 集群
```

### 为什么要用这套环境

因为你不是在搭生产集群，你是在学习 Kubernetes 的核心对象和工作方式。  
真正重要的是理解 Kubernetes 的行为，而不是先去搭三台物理机。

### 每个组件的意义

`Docker Desktop`：提供容器运行能力。没有它，kind 无法启动节点。

`WSL 2`：提供 Linux 命令行环境。大多数 Kubernetes 工具在 Linux 终端里体验最好。

`kind`：用 Docker 容器模拟 Kubernetes 节点。它的意义是“让你在本机快速拥有一个可用集群”。

`kubectl`：操作集群的客户端。它的意义是“把你的意图告诉 Kubernetes”。

### 为什么不用真实服务器

因为入门阶段你要学的是：

- Deployment 为什么存在
- Service 为什么存在
- 为什么 Pod 会自动恢复
- 为什么用 YAML 管理资源
- 为什么镜像更新不是手工重启

这些知识在本地 kind 上和在云上本质一样。

---

## 2. 为什么先检查 Docker、kubectl、kind

### 你要做什么

在 WSL 里执行：

```bash
docker version
docker ps
kubectl version --client
kind version
```

### 为什么这样做

因为 Kubernetes 不是一个单独的二进制程序，而是一整套系统。  
你每次操作，至少依赖三层：

1. 底层容器运行能力
2. 本地集群工具
3. Kubernetes 客户端

如果这三层里有一层坏了，后面的所有学习都会变成误判。

### 这样做的意义

你是在确认：

```text
容器能不能跑
集群能不能建
命令能不能发
```

这一步的意义不是“完成安装”，而是建立一个最小可工作的实验环境。

### 做完你应该理解什么

以后遇到问题，先分层看：

- `docker` 不通：是容器层问题
- `kind` 不通：是集群层问题
- `kubectl` 不通：是客户端或 kubeconfig 问题

这比盲目重装有用得多。

---

## 3. 为什么要创建 kind 集群

### 你要做什么

```bash
kind create cluster --name k8s-learning --image m.daocloud.io/docker.io/kindest/node:v1.30.0
kubectl get nodes
kubectl get pods -A
```

### 为什么这样做

因为 Kubernetes 不是“一个命令”，它是一个运行中的集群。  
你要学的所有对象，比如：

- Pod
- Deployment
- Service
- ConfigMap
- Secret

都必须存在于某个 Kubernetes 集群里。

### 这样做的意义

创建 kind 集群的意义，是先给自己搭一个实验场。  
你之后敲的每一个 `kubectl` 命令，都是在改这个实验场里的状态。

### 你应该理解什么

`kubectl get nodes` 不是为了看个列表，而是为了确认：

```text
我现在真的连到一个 Kubernetes 集群了
```

`Node` 的意义是“集群里的机器”。  
在 kind 里它是 Docker 容器模拟的，但 Kubernetes 对它的理解还是“节点”。

---

## 4. 为什么第一个对象是 Deployment，不是直接用 Pod

### 你要做什么

```bash
kubectl create deployment nginx --image=m.daocloud.io/docker.io/nginx:1.27
kubectl get deployments
kubectl get pods
```

### 为什么这样做

因为在真实使用里，你几乎不会直接管理裸 Pod。  
直接创建一个 Pod 的问题是：

- 它挂了以后谁来补？
- 你要扩成 5 个怎么办？
- 你要滚动升级怎么办？
- 你要回滚怎么办？

Pod 只是运行单位，不是合适的长期管理单位。

### Deployment 的意义

Deployment 的本质不是“启动一个 nginx”，而是：

```text
声明我希望某个应用以某种方式长期存在
```

它会负责：

- 创建 Pod
- 保持副本数
- 处理升级
- 支持回滚

### 做完你应该理解什么

你不是在命令 Kubernetes “帮我现在启动一个容器”，而是在告诉它：

```text
以后一直维持这个应用处于我声明的状态
```

这就是 Kubernetes 和直接用 Docker 运行容器的核心区别。

---

## 5. 为什么要看 Pod

### 你要做什么

```bash
kubectl get pods
kubectl describe pod <pod-name>
kubectl logs <pod-name>
kubectl exec -it <pod-name> -- sh
```

### 为什么这样做

Deployment 是“管理层”，Pod 才是“执行层”。  
应用到底有没有起来、出没出错、日志是什么、容器内部状态怎样，最终都要看 Pod。

### 这样做的意义

你在训练自己从“抽象对象”落到“运行实例”。

很多初学者会停在 Deployment 层面，以为：

```text
kubectl get deployment 显示有资源
就等于应用没问题
```

这是错的。真正的问题通常发生在 Pod 层：

- 镜像拉不下来
- 容器启动崩溃
- 端口没监听
- 启动命令写错

### 每个命令的意义

`kubectl get pods`：看当前运行实例是否存在，状态是什么。

`kubectl describe pod`：看详细信息，尤其是 `Events`，这通常是排错第一入口。

`kubectl logs`：看应用进程输出了什么。

`kubectl exec -it ... -- sh`：进入容器内部确认真实运行环境。

### 做完你应该理解什么

Kubernetes 的排错思路不是“猜”，而是从 Pod 状态、事件、日志、容器内部环境一路往下查。

---

## 6. 为什么要创建 Service

### 你要做什么

```bash
kubectl expose deployment nginx --port=80
kubectl get svc
kubectl port-forward svc/nginx 8080:80
```

### 为什么这样做

因为 Pod 本身不是稳定访问入口。  
Pod 会被重建，名字会变，IP 也会变。

如果你直接依赖某个 Pod：

```text
Pod 一重建
访问地址就变了
```

这对系统来说是不可靠的。

### Service 的意义

Service 的作用是：

```text
给一组 Pod 提供一个稳定的访问入口
```

它不是“又起了一个容器”，而是 Kubernetes 里的网络抽象。

### 为什么要用 port-forward

在本地 kind 学习环境里，你最容易验证 Service 的方式不是搞复杂的 NodePort 或 Ingress，而是：

```bash
kubectl port-forward svc/nginx 8080:80
```

它的意义是：

```text
把你电脑上的 8080 端口
临时转发到集群里的 nginx Service 80 端口
```

### 做完你应该理解什么

Pod 解决的是“应用怎么跑起来”。  
Service 解决的是“外部或其他服务怎么稳定找到它”。

---

## 7. 为什么要从命令切到 YAML

### 你要做什么

先在你的练习目录里创建两个文件：

`nginx-deployment.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-yaml
spec:
  replicas: 2
  selector:
    matchLabels:
      app: nginx-yaml
  template:
    metadata:
      labels:
        app: nginx-yaml
    spec:
      containers:
        - name: nginx
          image: m.daocloud.io/docker.io/nginx:1.27
          ports:
            - containerPort: 80
```

`nginx-service.yaml`

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-yaml
spec:
  type: ClusterIP
  selector:
    app: nginx-yaml
  ports:
    - port: 80
      targetPort: 80
```

然后执行：

```bash
kubectl apply -f nginx-deployment.yaml
kubectl apply -f nginx-service.yaml
kubectl get deployments
kubectl get pods
kubectl get svc
kubectl port-forward svc/nginx-yaml 8081:80
```

浏览器打开：

```text
http://localhost:8081
```

### 为什么这样做

因为命令式操作只适合临时实验，不适合长期管理。

比如你执行：

```bash
kubectl create deployment nginx ...
```

过几天你很可能记不住：

- 镜像版本是什么
- 副本数是多少
- 端口是什么
- 环境变量是什么

### YAML 的意义

YAML 的本质不是“写配置文件”，而是：

```text
把你希望系统长成什么样，明确写成可重复执行的声明
```

这件事的意义非常大，因为它意味着：

- 资源可以版本管理
- 资源可以审查
- 资源可以复制到别的环境
- 资源状态有明确来源

### 为什么是 `kubectl apply`

`apply` 的意义是“让集群状态向你这份文件靠拢”。  
它不是单纯创建，而是声明式同步。

### 做完你应该理解什么

Kubernetes 不是一个“多打几条命令”的工具，它更接近“声明系统目标状态并持续收敛”的系统。

### 这份 YAML 为什么这样写

`metadata.name: nginx-yaml`：定义这个资源在集群里的名字。

`replicas: 2`：声明希望有 2 个 Pod 副本。

`selector.matchLabels.app: nginx-yaml`：Deployment 用它来识别“哪些 Pod 归我管”。

`template.metadata.labels.app: nginx-yaml`：新创建出来的 Pod 会带上这个标签。

`image: m.daocloud.io/docker.io/nginx:1.27`：指定容器用哪个镜像。

`containerPort: 80`：告诉 Kubernetes 这个容器主要对外服务的端口是 80。

`Service.selector.app: nginx-yaml`：Service 通过这个标签找到 Deployment 创建的 Pod。

`port: 80` 和 `targetPort: 80`：表示 Service 自己暴露 80，并转发给 Pod 的 80 端口。

---

## 8. 为什么要扩容

### 你要做什么

```bash
kubectl scale deployment nginx-yaml --replicas=5
kubectl get pods
```

### 为什么这样做

因为单实例应用很脆弱，也撑不住更高流量。  
现实中的系统经常需要：

- 多个副本分摊请求
- 某个实例挂了以后还有其他实例顶上

### `replicas` 的意义

`--replicas=5` 的意思不是“马上启动 5 个就完了”，而是：

```text
我期望这个应用一直保持 5 个实例
```

### 这样做的意义

你在学习 Kubernetes 的核心能力：

```text
声明期望状态
而不是手工维护每个实例
```

### 做完你应该理解什么

扩容不是靠你手工多开几个容器，而是靠控制器维护副本数。

---

## 9. 为什么删除一个 Pod 它会自己回来

### 你要做什么

```bash
kubectl delete pod <pod-name>
kubectl get pods
```

### 为什么这样做

这是为了验证 Kubernetes 的“自愈”能力。

### 为什么会自动恢复

因为你删掉的是 Pod，不是 Deployment。  
而 Deployment 还在，它的目标依然是：

```text
保持 5 个副本
```

所以控制器会发现：

```text
当前 4 个
期望 5 个
```

然后自动补一个。

### 这样做的意义

这一步在告诉你一个关键事实：

```text
Pod 不是你要依赖的长期对象
Pod 是会被替换的
真正稳定的是控制器声明的目标
```

### 做完你应该理解什么

Kubernetes 管理的不是“某个 конкрет Pod 必须永远活着”，而是“这类 Pod 的数量和规格必须被维持”。

---

## 10. 为什么要滚动更新和回滚

### 你要做什么

```bash
kubectl set image deployment/nginx-yaml nginx=m.daocloud.io/docker.io/nginx:1.28
kubectl rollout status deployment/nginx-yaml
kubectl rollout history deployment/nginx-yaml
kubectl rollout undo deployment/nginx-yaml
```

### 为什么这样做

真实系统不可能永远不升级。  
你会不断改：

- 镜像版本
- 配置
- 启动参数

问题是，升级不能靠粗暴重启，否则会中断服务。

### 滚动更新的意义

滚动更新的本质是：

```text
逐步创建新版本 Pod
逐步替换旧版本 Pod
尽量保证服务不中断
```

### 为什么要看 rollout status

因为你不能只发命令，不看结果。  
`rollout status` 的意义是确认：

```text
这次升级到底成功了没有
```

### 为什么要看 rollout history

因为生产系统最怕“改了以后记不清改过什么”。  
历史记录的意义是给你提供版本轨迹。

### 为什么要 rollback

因为升级不是总会成功。  
回滚的意义是：

```text
在新版本不稳定时，快速恢复到上一个可用版本
```

### 做完你应该理解什么

Deployment 不只是“启动应用”，它还承载了发布管理能力。这就是 Kubernetes 在工程上的真正价值之一。

---

## 11. 为什么要用 ConfigMap

### 你要做什么

```bash
kubectl create configmap app-config --from-literal=APP_ENV=dev
```

确认它存在：

```bash
kubectl get configmap
kubectl describe configmap app-config
```

然后创建 `demo-configmap.yaml`：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: demo-configmap
spec:
  replicas: 1
  selector:
    matchLabels:
      app: demo-configmap
  template:
    metadata:
      labels:
        app: demo-configmap
    spec:
      containers:
        - name: busybox
          image: m.daocloud.io/docker.io/busybox:1.36
          command: ["sh", "-c", "echo APP_ENV=$APP_ENV && sleep 3600"]
          env:
            - name: APP_ENV
              valueFrom:
                configMapKeyRef:
                  name: app-config
                  key: APP_ENV
```

应用并验证：

```bash
kubectl apply -f demo-configmap.yaml
kubectl get pods
kubectl logs deploy/demo-configmap
```

正常的话，日志里会出现：

```text
APP_ENV=dev
```

### 为什么这样做

因为应用配置不应该写死在镜像里。

比如这些信息经常会变：

- 当前环境是 `dev` 还是 `prod`
- 日志级别是 `debug` 还是 `info`
- 某个功能开关开还是关

如果每改一次配置都要重建镜像，成本很高，也不合理。

### ConfigMap 的意义

ConfigMap 解决的是：

```text
把“应用程序代码”和“运行时配置”分开
```

### 这样做的意义

这样同一份镜像可以在不同环境运行，只是注入不同配置。

例如：

```text
同一个应用镜像
在 dev 注入 APP_ENV=dev
在 prod 注入 APP_ENV=prod
```

### 做完你应该理解什么

镜像描述的是“程序是什么”。  
ConfigMap 描述的是“程序运行时要用什么普通配置”。

### 这份 YAML 为什么这样写

`command: ["sh", "-c", "echo APP_ENV=$APP_ENV && sleep 3600"]`：这里不是生产写法，只是教学写法。它的目的很明确，就是把环境变量打印出来给你看，然后让容器别立刻退出。

`env`：定义容器启动时要注入哪些环境变量。

`valueFrom.configMapKeyRef`：不是把值写死，而是告诉 Kubernetes 去 `app-config` 这个 ConfigMap 里找 `APP_ENV` 这个键。

---

## 12. 为什么要用 Secret

### 你要做什么

```bash
kubectl create secret generic db-secret --from-literal=DB_PASSWORD=123456
```

确认它存在：

```bash
kubectl get secret
kubectl describe secret db-secret
```

然后创建 `demo-secret.yaml`：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: demo-secret
spec:
  replicas: 1
  selector:
    matchLabels:
      app: demo-secret
  template:
    metadata:
      labels:
        app: demo-secret
    spec:
      containers:
        - name: busybox
          image: m.daocloud.io/docker.io/busybox:1.36
          command: ["sh", "-c", "echo DB_PASSWORD=$DB_PASSWORD && sleep 3600"]
          env:
            - name: DB_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: db-secret
                  key: DB_PASSWORD
```

应用并验证：

```bash
kubectl apply -f demo-secret.yaml
kubectl get pods
kubectl logs deploy/demo-secret
```

正常的话，日志里会出现：

```text
DB_PASSWORD=123456
```

### 为什么这样做

因为密码、Token、证书这类东西不能和普通配置混在一起管理。

### Secret 的意义

Secret 解决的是：

```text
敏感配置需要被单独管理
```

### 它和 ConfigMap 的区别

从“使用方式”看很像，都是把值注入 Pod。  
但从“语义”和“管理要求”看不同：

- ConfigMap：普通配置
- Secret：敏感配置

### 这样做的意义

这能让你在权限控制、审计、加密策略上区别对待不同信息。

### 你还应该知道什么

Kubernetes 默认 Secret 只是 base64 编码，不等于强加密。  
所以它的意义首先是“管理语义清晰”，然后才是配合更完整的安全体系。

### 这份 YAML 为什么这样写

它和 ConfigMap 的例子长得很像，是故意这样设计的。  
因为你要看清楚：普通配置和敏感配置在“注入方式”上很接近，但在“语义”和“治理要求”上完全不同。

`secretKeyRef` 的意义就是：

```text
不要把敏感值直接写死在 Pod 配置里
而是运行时从 Secret 里取
```

---

## 13. 为什么要用 Namespace

### 你要做什么

```bash
kubectl create namespace dev
kubectl get namespaces
kubectl apply -f nginx-deployment.yaml -n dev
kubectl get pods -n dev
kubectl get pods
```

### 为什么这样做

因为一个集群里通常不只跑一个应用，也不只服务一个环境或团队。

如果所有资源都堆在 `default` 里，会很混乱：

- 开发环境和生产环境名字冲突
- 不同团队资源混在一起
- 权限边界不好划

### Namespace 的意义

Namespace 解决的是：

```text
在同一个集群里做逻辑隔离
```

### 这样做的意义

它让你可以在一个集群里组织不同的环境或团队，例如：

```text
dev
test
staging
prod
```

或者：

```text
frontend
backend
platform
```

### 做完你应该理解什么

Namespace 不是“多建一个文件夹”，而是集群内资源组织和隔离的基本单位。

### 你实际会看到什么

如果你已经在 `default` 里部署过 `nginx-yaml`，再执行：

```bash
kubectl apply -f nginx-deployment.yaml -n dev
```

你会发现：

```bash
kubectl get pods
kubectl get pods -n dev
```

看到的是两套互相隔离的资源。

这就是 Namespace 最直观的意义：同名资源可以在不同命名空间分别存在，因为它们属于不同的逻辑边界。

---

## 14. 为什么排错总是从 Pod、Events、Logs 开始

### 你要做什么

```bash
kubectl get pods
kubectl describe pod <pod-name>
kubectl logs <pod-name>
kubectl get events --sort-by=.metadata.creationTimestamp
```

### 为什么这样做

因为 Kubernetes 出问题时，最常见的根因都体现在三个地方：

- Pod 当前状态
- 调度/拉镜像/启动事件
- 应用日志

### 每一步的意义

`kubectl get pods`：先看问题属于哪一类，是没启动、拉镜像失败还是反复崩溃。

`kubectl describe pod`：看系统层面发生了什么，尤其是 `Events`。

`kubectl logs`：看应用层面发生了什么。

`kubectl get events`：看整个集群最近发生了哪些事。

### 这样做的意义

你是在区分：

```text
这是 Kubernetes 层问题
还是应用层问题
```

这一步能力非常关键。很多人花很久都学不会 Kubernetes，根本原因不是不会写 YAML，而是不会分层排错。

---

## 15. YAML 为什么值得你认真学

你后面可能会觉得：

```text
命令也能创建资源
为什么还要写 YAML
```

真正原因是，Kubernetes 本质上是声明式系统。  
你要管理的不是“我刚才执行了什么命令”，而是：

```text
我希望集群长期维持怎样的状态
```

YAML 的意义在于把这个目标状态变成：

- 可保存
- 可审查
- 可复用
- 可回滚
- 可自动化

后面你学 Helm，其实也是在更高层生成 YAML。  
所以 YAML 不是可选技能，而是 Kubernetes 的基础语言。

---

## 16. 你应该怎样练，而不是只看

每学一个对象，都用这四个问题逼自己：

1. 它解决什么问题？
2. 如果没有它，会有什么麻烦？
3. 它和别的对象是什么关系？
4. 出问题时我去哪看？

例如 Deployment：

1. 它解决长期运行和发布管理问题
2. 没有它你只能手工维护 Pod
3. 它管理 Pod
4. 出问题要看 Pod 和 rollout

例如 Service：

1. 它解决稳定访问问题
2. 没有它 Pod 重建后地址就变
3. 它把请求转给 Pod
4. 出问题要看 selector、endpoints、端口

这才是有效学习。

---

## 17. 7 天练习计划

### 第 1 天：环境和集群

目标：

- 明白这不是“装工具”，而是在搭实验环境
- 明白 Docker、kind、kubectl 各自负责什么

执行：

```bash
docker version
docker ps
kubectl version --client
kind version
kind create cluster --name k8s-learning --image m.daocloud.io/docker.io/kindest/node:v1.30.0
kubectl get nodes
kubectl get pods -A
```

今天最重要的理解：

```text
Kubernetes 操作一定发生在一个真实运行的集群里
```

### 第 2 天：Deployment 和 Pod

目标：

- 明白为什么不是直接管 Pod
- 明白 Pod 是真正运行实例

执行：

```bash
kubectl create deployment nginx --image=m.daocloud.io/docker.io/nginx:1.27
kubectl get deployments
kubectl get pods
kubectl describe pod <pod-name>
kubectl logs <pod-name>
kubectl exec -it <pod-name> -- sh
```

今天最重要的理解：

```text
Deployment 管理期望状态
Pod 承载实际运行
```

### 第 3 天：Service

目标：

- 明白为什么 Pod 不能作为稳定访问入口
- 明白 Service 的作用

执行：

```bash
kubectl expose deployment nginx --port=80
kubectl get svc
kubectl port-forward svc/nginx 8080:80
```

今天最重要的理解：

```text
Pod 解决“怎么跑”
Service 解决“怎么找”
```

### 第 4 天：YAML

目标：

- 明白为什么要声明式管理资源
- 明白 `apply` 的意义

执行：

```bash
kubectl apply -f nginx-deployment.yaml
kubectl apply -f nginx-service.yaml
kubectl get all
```

今天最重要的理解：

```text
YAML 是目标状态描述
apply 是让集群向目标状态收敛
```

### 第 5 天：扩容、自愈、升级、回滚

目标：

- 明白 Kubernetes 为什么适合长期管理应用

执行：

```bash
kubectl scale deployment nginx-yaml --replicas=5
kubectl delete pod <pod-name>
kubectl set image deployment/nginx-yaml nginx=m.daocloud.io/docker.io/nginx:1.28
kubectl rollout status deployment/nginx-yaml
kubectl rollout history deployment/nginx-yaml
kubectl rollout undo deployment/nginx-yaml
```

今天最重要的理解：

```text
Kubernetes 维护的是目标状态
不是某个具体实例
```

### 第 6 天：ConfigMap、Secret、Namespace

目标：

- 明白配置为什么要和镜像分离
- 明白敏感配置为什么单独管理
- 明白资源为什么要隔离

执行：

```bash
kubectl create configmap app-config --from-literal=APP_ENV=dev
kubectl create secret generic db-secret --from-literal=DB_PASSWORD=123456
kubectl create namespace dev
```

今天最重要的理解：

```text
代码、配置、敏感信息、环境边界
应该被明确分离
```

### 第 7 天：排错

目标：

- 学会分层定位问题

执行：

```bash
kubectl create deployment bad-image --image=nginx:not-exist
kubectl get pods
kubectl describe pod <pod-name>
kubectl get events --sort-by=.metadata.creationTimestamp
kubectl delete deployment bad-image
```

今天最重要的理解：

```text
排错不是背答案
而是从状态、事件、日志分层定位
```

---

## 18. 入门完成标准

当你能回答清楚下面这些问题，并亲手做过对应操作，就算真正入门了：

- 为什么 Kubernetes 不建议直接管理裸 Pod？
- 为什么需要 Service，而不是直接记住 Pod 名？
- 为什么 Deployment 能做到自动恢复？
- 为什么要用 YAML，而不是只靠命令？
- 为什么配置不应该写死在镜像里？
- 为什么敏感信息和普通配置要分开？
- 为什么一个集群里要有 Namespace？
- 为什么升级后要看 rollout status？
- 为什么排错先看 describe、logs、events？

你如果只是“会敲命令”，这还不算学会。  
你能解释“为什么这样设计”，才说明你真正开始理解 Kubernetes。
