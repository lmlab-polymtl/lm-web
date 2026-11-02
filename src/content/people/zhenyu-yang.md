---
name: Zhenyu Yang
image: /uploads/cat-zhenyu-yang-v2.png
role: PhD Student
group: PhD
order: 5
interests:
  - Out-of-distribution detection
  - Adversarial attacks
  - Adversarial training
  - Deep neural network reliability
  - LLM user simulation
projects:
  - robust-ood-detection
  - llm-user-simulation-evaluation
links: []
mila: https://mila.quebec/en/directory/zhenyu-yang
---

Zhenyu Yang works on the reliability of deployed deep neural network systems, with an emphasis on adversarial attacks, adversarial training, and out-of-distribution detection.

Zhenyu is currently developing a robust OOD detection methodology for deployed DNN systems. Modern software systems increasingly integrate DNNs, which makes reliability especially important in safety-critical domains. A common but flawed assumption is that test data follows the same distribution as training data. In practice, deployed systems often encounter inputs that differ from training data, which can cause major performance degradation and unreliable predictions.

OOD detection addresses this by assigning a confidence score that reflects the robustness of a model's prediction. If the score exceeds a predefined threshold, the input is treated as in-distribution and the prediction can be trusted; otherwise, it is treated as OOD and rejected. Zhenyu's work aims to develop a novel OOD detection method with state-of-the-art performance across DNN architectures, including transformer-based models.

Zhenyu is also working on user simulation with large language models. User simulation can reduce the cost of evaluating task-oriented AI systems, but existing simulation strategies lack systematic frameworks for rigorously assessing simulation quality. This work aims to design a principled evaluation framework for that gap.
