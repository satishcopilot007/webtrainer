export const FREE_COURSE_TOPICS = {
  genai: {
    shortTitle: 'GenAI',
    title: 'Generative AI',
    icon: '✨',
    color: 'from-violet-600 to-fuchsia-500',
    description: 'Learn how modern generative AI systems create text, images, and code, then build safe, useful AI applications.',
    level: 'Beginner to intermediate',
    duration: '8 hours',
    prerequisites: 'Basic computer skills; Python is helpful but not required.',
    outcomes: ['Explain how large language models work', 'Write reliable prompts', 'Build a retrieval-augmented assistant', 'Evaluate safety, quality, and cost'],
    modules: [
      {
        title: 'Generative AI foundations',
        summary: 'Understand the concepts behind models that generate new content.',
        lessons: [
          { title: 'What is Generative AI?', content: 'Generative AI learns patterns from examples and produces new text, images, audio, video, or code. Unlike a classifier that selects a label, a generative model predicts and constructs an output based on its input and learned context.', practice: 'List three generative and three non-generative AI use cases.' },
          { title: 'Tokens, context, and prediction', content: 'Language models divide input into tokens and predict likely next tokens. The context window limits how much information can be considered at one time, so clear, relevant context usually improves an answer.', practice: 'Compare the token length of a short question and a detailed prompt.' },
          { title: 'Transformers and attention', content: 'Transformers process relationships among tokens using attention. Attention helps the model weigh relevant words and concepts, while multiple layers build increasingly useful representations.', practice: 'Explain attention using a sentence containing an ambiguous pronoun.' },
        ],
      },
      {
        title: 'Prompt engineering',
        summary: 'Create prompts that produce clearer and more repeatable results.',
        lessons: [
          { title: 'Anatomy of a strong prompt', content: 'A useful prompt commonly includes a role, objective, relevant context, constraints, and an output format. Concrete success criteria reduce ambiguity and make responses easier to evaluate.', practice: 'Rewrite a vague summarization request using all five elements.' },
          { title: 'Examples and structured output', content: 'Few-shot examples demonstrate the expected pattern. Asking for JSON, a table, or a fixed template makes generated output easier to validate and use in software.', practice: 'Design a prompt that extracts support tickets into a JSON schema.' },
          { title: 'Prompt testing and iteration', content: 'Prompts should be tested against normal, edge, and adversarial inputs. Track accuracy, consistency, latency, and cost instead of judging a prompt from one successful response.', practice: 'Create five test cases for a course-recommendation prompt.' },
        ],
      },
      {
        title: 'Building grounded applications',
        summary: 'Connect models to trusted knowledge and application tools.',
        lessons: [
          { title: 'Embeddings and semantic search', content: 'Embeddings represent meaning as vectors. Similar vectors can retrieve related passages even when they do not share exact keywords, making them useful for knowledge search.', practice: 'Identify which documents should be retrieved for three sample questions.' },
          { title: 'Retrieval-augmented generation', content: 'RAG retrieves relevant source material and includes it in the model context before generation. This can improve freshness and traceability, but retrieval quality and citations still require evaluation.', practice: 'Sketch a RAG flow from user question to cited answer.' },
          { title: 'Tools and agents', content: 'Tool-enabled models can call approved functions such as search, calculation, or booking. Agents add planning and repeated actions, so permissions, limits, and human approval are important.', practice: 'Define safe tool permissions for a training-support assistant.' },
        ],
      },
      {
        title: 'Responsible production use',
        summary: 'Evaluate output and manage privacy, safety, and operating cost.',
        lessons: [
          { title: 'Hallucinations and evaluation', content: 'Generated answers may sound confident while being incorrect. Use reference-based tests, expert review, grounded citations, and refusal behavior to measure quality.', practice: 'Write a ten-question evaluation set with expected answers.' },
          { title: 'Privacy and prompt injection', content: 'Do not send unnecessary sensitive data to a model. Treat retrieved content and user input as untrusted, isolate instructions from data, and restrict tool access.', practice: 'Find the security weaknesses in a fictional document assistant.' },
          { title: 'Latency and cost controls', content: 'Model size, token count, retrieval, and repeated calls affect speed and cost. Cache safe results, limit context, choose suitable models, and monitor usage.', practice: 'Propose three ways to reduce the cost of a high-volume chatbot.' },
        ],
      },
    ],
  },
  aiml: {
    shortTitle: 'AIML',
    title: 'Artificial Intelligence & Machine Learning',
    icon: '🧠',
    color: 'from-blue-600 to-cyan-500',
    description: 'Master the essential AI and machine-learning workflow—from data preparation to evaluated, deployable models.',
    level: 'Beginner to intermediate',
    duration: '10 hours',
    prerequisites: 'Basic algebra and introductory Python are recommended.',
    outcomes: ['Distinguish major machine-learning approaches', 'Prepare data for training', 'Train and evaluate common models', 'Recognize bias, leakage, and overfitting'],
    modules: [
      {
        title: 'AI and ML essentials',
        summary: 'Learn the vocabulary, workflows, and major learning approaches.',
        lessons: [
          { title: 'AI, ML, and deep learning', content: 'Artificial intelligence is the broad goal of machine-like intelligent behavior. Machine learning learns patterns from data, while deep learning uses multi-layer neural networks for complex representations.', practice: 'Classify five products as rule-based AI, ML, or deep learning.' },
          { title: 'Supervised and unsupervised learning', content: 'Supervised learning uses labeled examples for prediction. Unsupervised learning discovers structure without target labels, while reinforcement learning learns actions from rewards.', practice: 'Choose a learning approach for churn, segmentation, and game playing.' },
          { title: 'The ML lifecycle', content: 'A practical lifecycle includes problem definition, data collection, exploration, preparation, training, evaluation, deployment, and monitoring. Business success criteria should be defined first.', practice: 'Write measurable success criteria for a spam detector.' },
        ],
      },
      {
        title: 'Working with data',
        summary: 'Prepare reliable features while avoiding common data problems.',
        lessons: [
          { title: 'Features, labels, and datasets', content: 'Features are model inputs and labels are target outcomes. Each row should represent the correct unit of observation, and the dataset should reflect the population where predictions will be used.', practice: 'Define features and a label for student completion prediction.' },
          { title: 'Cleaning and preprocessing', content: 'Real data may contain missing values, duplicates, outliers, and inconsistent categories. Numerical scaling and categorical encoding must be fitted using training data only.', practice: 'Create a cleaning checklist for a customer dataset.' },
          { title: 'Train, validation, and test sets', content: 'Training data fits the model, validation data guides choices, and test data estimates final generalization. Time-based problems often require chronological rather than random splits.', practice: 'Choose an appropriate split for monthly sales forecasting.' },
        ],
      },
      {
        title: 'Models and evaluation',
        summary: 'Select algorithms and measure what matters for the problem.',
        lessons: [
          { title: 'Regression and classification', content: 'Regression predicts continuous values; classification predicts categories or probabilities. Linear models provide strong baselines, while trees capture nonlinear rules and interactions.', practice: 'Choose regression or classification for six business questions.' },
          { title: 'Metrics that match the goal', content: 'Accuracy can hide poor minority-class performance. Precision, recall, F1, ROC-AUC, MAE, and RMSE answer different questions, so select metrics based on the cost of errors.', practice: 'Select a primary metric for fraud detection and explain why.' },
          { title: 'Overfitting and regularization', content: 'An overfit model memorizes training details and performs poorly on new data. Simpler models, regularization, cross-validation, more representative data, and early stopping can improve generalization.', practice: 'Diagnose a model with 99% training and 72% test accuracy.' },
        ],
      },
      {
        title: 'Deployment and responsible ML',
        summary: 'Move models into production and monitor their real-world impact.',
        lessons: [
          { title: 'From notebook to prediction service', content: 'Production systems package preprocessing and model logic together, expose a stable interface, validate input, log outcomes, and support versioning and rollback.', practice: 'Draw the components of a real-time prediction API.' },
          { title: 'Drift and monitoring', content: 'Data distributions and relationships can change after deployment. Monitor input drift, prediction quality, latency, errors, and business outcomes, then define retraining triggers.', practice: 'Choose five monitoring signals for a demand forecast.' },
          { title: 'Fairness and explainability', content: 'Models can reproduce historical bias or underperform for specific groups. Evaluate segmented metrics, document limitations, use suitable explanations, and retain human oversight for high-impact decisions.', practice: 'Create a fairness review checklist for a hiring model.' },
        ],
      },
    ],
  },
  cloud: {
    shortTitle: 'Cloud',
    title: 'Cloud Computing',
    icon: '☁️',
    color: 'from-sky-600 to-indigo-500',
    description: 'Understand cloud architecture and learn to design secure, scalable, and cost-aware applications across major providers.',
    level: 'Beginner',
    duration: '8 hours',
    prerequisites: 'General knowledge of computers, networks, and web applications.',
    outcomes: ['Explain cloud service and deployment models', 'Select compute, storage, and database services', 'Apply security and reliability principles', 'Plan a basic cloud architecture'],
    modules: [
      {
        title: 'Cloud fundamentals',
        summary: 'Understand on-demand computing and the shared-responsibility model.',
        lessons: [
          { title: 'What is cloud computing?', content: 'Cloud computing provides configurable technology resources over a network with on-demand access, measured usage, and rapid scaling. It shifts many infrastructure tasks from purchasing hardware to consuming services.', practice: 'Compare cloud hosting with an on-premises server for a startup.' },
          { title: 'IaaS, PaaS, and SaaS', content: 'IaaS offers infrastructure primitives, PaaS manages more of the application platform, and SaaS delivers complete software. More management by the provider usually means less customer control and operational work.', practice: 'Classify ten familiar technology products by service model.' },
          { title: 'Public, private, and hybrid cloud', content: 'Public clouds share provider infrastructure, private clouds serve one organization, and hybrid designs connect environments. Requirements for regulation, latency, existing systems, and skills influence the choice.', practice: 'Recommend a deployment model for a regulated organization.' },
        ],
      },
      {
        title: 'Core building blocks',
        summary: 'Select compute, networking, storage, and data services.',
        lessons: [
          { title: 'Compute choices', content: 'Virtual machines offer operating-system control, containers package applications consistently, and serverless services run code without managing servers. Workload behavior determines the best fit.', practice: 'Choose compute for a legacy app, API, and scheduled task.' },
          { title: 'Networking basics', content: 'Cloud networks use private address spaces, subnets, routes, firewalls, load balancers, DNS, and gateways. Segmenting public and private resources reduces exposure.', practice: 'Sketch a network with a public load balancer and private application tier.' },
          { title: 'Storage and databases', content: 'Object storage suits files and large unstructured data, block storage supports disks, and file storage provides shared folders. Managed relational and NoSQL databases address different consistency and query needs.', practice: 'Select storage for images, VM disks, shared files, and orders.' },
        ],
      },
      {
        title: 'Security and reliability',
        summary: 'Protect identities and design systems that survive failure.',
        lessons: [
          { title: 'Identity and least privilege', content: 'Grant identities only the permissions needed for their task and duration. Prefer roles and temporary credentials, require strong authentication, and review access regularly.', practice: 'Reduce the permissions of an overly broad developer role.' },
          { title: 'Encryption and secrets', content: 'Protect data in transit with secure protocols and at rest with managed encryption. Store passwords, keys, and tokens in a secrets manager rather than source code or images.', practice: 'Identify secrets and encryption boundaries in a web application.' },
          { title: 'Availability, backup, and recovery', content: 'Use redundancy across failure zones, health checks, automated replacement, backups, and tested recovery procedures. Recovery time and recovery point objectives guide investment.', practice: 'Define RTO and RPO targets for an online learning portal.' },
        ],
      },
      {
        title: 'Operations and cost',
        summary: 'Observe, automate, and continuously improve cloud workloads.',
        lessons: [
          { title: 'Monitoring and observability', content: 'Metrics show numerical trends, logs record events, and traces follow requests across services. Alerts should be actionable and tied to user impact rather than every technical fluctuation.', practice: 'Choose signals for API availability, performance, and errors.' },
          { title: 'Infrastructure as code', content: 'Infrastructure as code defines environments in versioned, repeatable files. Reviews, automated validation, controlled deployment, and drift detection make changes safer.', practice: 'List resources that belong in an infrastructure template.' },
          { title: 'Cost optimization', content: 'Match resource size to demand, shut down waste, use autoscaling, choose suitable pricing commitments, and assign ownership with tags and budgets. Cost should be reviewed alongside reliability and performance.', practice: 'Create a monthly cost-review checklist for a small application.' },
        ],
      },
    ],
  },
};

export const FREE_COURSE_LIST = Object.entries(FREE_COURSE_TOPICS).map(([slug, topic]) => ({ slug, ...topic }));
