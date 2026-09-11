# AD2 independent architecture critic - AWS TARGET

VERDICT: PASS

1. **Status honesty:** every AWS statement is explicitly TARGET / NOT DEPLOYED. Nothing claims AWS runtime, AWS CI/CD, or AWS operational evidence exists today.
2. **Migration coherence:** ECS/Fargate is a proportionate target for the current stateless Next.js/Node server. EKS is intentionally omitted because it adds orchestration complexity without an observed requirement.
3. **Network path:** Route 53, CloudFront/WAF, ALB, private Fargate tasks, and controlled NAT egress form a coherent internet-facing architecture while keeping application tasks off public subnets.
4. **Secrets and delivery:** Secrets Manager, IAM/OIDC, ECR, and CloudWatch provide the missing cloud-operational controls without changing domain logic or introducing long-lived AWS keys into GitHub.
5. **Data discipline:** no database is forced into functional parity. ElastiCache is correctly marked OPTIONAL FUTURE only for stronger cross-instance rate/budget enforcement.
6. **Provider discipline:** OpenRouter remains the external provider behind `FactSelector`; Bedrock is not silently substituted. A provider migration would require a separately evaluated adapter decision.
