const questionBank = {
  "Frontend Developer": {
    easy: [
      "What is HTML?",
      "What is CSS?",
      "What is React?",
    ],

    medium: [
      "Explain useEffect hook.",
      "Difference between state and props?",
      "What is virtual DOM?",
    ],

    hard: [
      "Explain React reconciliation.",
      "How does React batching work?",
      "Explain code splitting in React.",
    ],
  },

  "Backend Developer": {
    easy: [
      "What is Node.js?",
      "What is Express.js?",
      "What is MongoDB?",
    ],

    medium: [
      "Explain JWT authentication.",
      "What is middleware in Express?",
      "Explain REST APIs.",
    ],

    hard: [
      "Explain event loop in Node.js.",
      "What is database indexing?",
      "Explain microservices architecture.",
    ],
  },

  "Full Stack Developer": {
    easy: [
      "What is MERN stack?",
      "What is frontend?",
      "What is backend?",
    ],

    medium: [
      "How frontend communicates with backend?",
      "What is authentication?",
      "Explain MongoDB aggregation.",
    ],

    hard: [
      "Explain system design basics.",
      "How would you scale an application?",
      "Explain API rate limiting.",
    ],
  },

  "UI/UX Designer": {
    easy: [
      "What is wireframing?",
      "Difference between UI and UX?",
      "What is responsive design?",
    ],

    medium: [
      "Explain accessibility in design.",
      "What is design hierarchy?",
      "What tools do you use for design?",
    ],

    hard: [
      "Explain user-centered design.",
      "How do you conduct UX research?",
      "Explain design systems.",
    ],
  },

  "Fashion Designer": {
    easy: [
      "What is fashion designing?",
      "What is color theory?",
      "What are fashion trends?",
    ],

    medium: [
      "How do you select fabrics?",
      "What inspires your designs?",
      "Explain client styling.",
    ],

    hard: [
      "Explain sustainable fashion.",
      "How do you forecast trends?",
      "Explain fashion branding.",
    ],
  },

  "Software Engineer": {
    easy: [
      "What is programming?",
      "What is OOP?",
      "What is debugging?",
    ],

    medium: [
      "Explain polymorphism.",
      "What are design patterns?",
      "Explain multithreading.",
    ],

    hard: [
      "Explain SOLID principles.",
      "How does dependency injection work?",
      "Explain system architecture.",
    ],
  },

  "Data Scientist": {
    easy: [
      "What is data science?",
      "What is machine learning?",
      "What is data analysis?",
    ],

    medium: [
      "Explain supervised learning.",
      "What is overfitting?",
      "Explain feature engineering.",
    ],

    hard: [
      "Explain cross-validation.",
      "What is dimensionality reduction?",
      "Explain ensemble learning.",
    ],
  },

  "Machine Learning Engineer": {
    easy: [
      "What is AI?",
      "What is deep learning?",
      "What is a neural network?",
    ],

    medium: [
      "Explain gradient descent.",
      "Difference between TensorFlow and PyTorch?",
      "What is transfer learning?",
    ],

    hard: [
      "Explain CNN architecture.",
      "What is reinforcement learning?",
      "Explain hyperparameter tuning.",
    ],
  },

  "DevOps Engineer": {
    easy: [
      "What is DevOps?",
      "What is Docker?",
      "What is CI/CD?",
    ],

    medium: [
      "Explain Kubernetes.",
      "What is containerization?",
      "Explain cloud deployment.",
    ],

    hard: [
      "Explain infrastructure as code.",
      "What is autoscaling?",
      "Explain monitoring pipelines.",
    ],
  },

  "Cybersecurity Analyst": {
    easy: [
      "What is cybersecurity?",
      "What is phishing?",
      "What is a firewall?",
    ],

    medium: [
      "Explain encryption.",
      "What is penetration testing?",
      "Difference between HTTP and HTTPS?",
    ],

    hard: [
      "Explain SQL injection.",
      "What is ethical hacking?",
      "Explain vulnerability assessment.",
    ],
  },

  "Mobile App Developer": {
    easy: [
      "What is React Native?",
      "What is a mobile app?",
      "What is app testing?",
    ],

    medium: [
      "Difference between native and hybrid apps?",
      "Explain app lifecycle.",
      "How do APIs work in mobile apps?",
    ],

    hard: [
      "Explain deep linking.",
      "How do you optimize mobile performance?",
      "Explain offline storage handling.",
    ],
  },

  "Cloud Engineer": {
    easy: [
      "What is cloud computing?",
      "What is AWS?",
      "What is SaaS?",
    ],

    medium: [
      "Difference between IaaS and PaaS?",
      "Explain serverless architecture.",
      "What is cloud scalability?",
    ],

    hard: [
      "Explain disaster recovery.",
      "What is cloud security?",
      "Explain load balancing.",
    ],
  },

  "Product Manager": {
    easy: [
      "Who is a product manager?",
      "What is a product roadmap?",
      "What is MVP?",
    ],

    medium: [
      "How do you prioritize features?",
      "Explain agile methodology.",
      "What are KPIs?",
    ],

    hard: [
      "How do you analyze competitors?",
      "Explain stakeholder management.",
      "How do you scale a product?",
    ],
  },

  "HR Manager": {
    easy: [
      "What is HR management?",
      "What is recruitment?",
      "What is onboarding?",
    ],

    medium: [
      "How do you conduct interviews?",
      "Explain employee engagement.",
      "What is talent acquisition?",
    ],

    hard: [
      "How do you resolve workplace conflicts?",
      "Explain performance management.",
      "How do you improve retention?",
    ],
  },

  "Digital Marketing Specialist": {
    easy: [
      "What is SEO?",
      "What is social media marketing?",
      "What is branding?",
    ],

    medium: [
      "Explain content marketing.",
      "How does Google Ads work?",
      "What is email marketing?",
    ],

    hard: [
      "Explain conversion optimization.",
      "How do you analyze campaigns?",
      "What is influencer marketing?",
    ],
  },

  "Business Analyst": {
    easy: [
      "Who is a business analyst?",
      "What is SWOT analysis?",
      "What are requirements?",
    ],

    medium: [
      "How do you gather requirements?",
      "Explain process modeling.",
      "What is gap analysis?",
    ],

    hard: [
      "Explain stakeholder management.",
      "Difference between Agile and Waterfall?",
      "How do you handle project risks?",
    ],
  },

  "QA Engineer": {
    easy: [
      "What is software testing?",
      "What is a test case?",
      "What is manual testing?",
    ],

    medium: [
      "Difference between manual and automation testing?",
      "Explain regression testing.",
      "What is Selenium?",
    ],

    hard: [
      "Explain API testing.",
      "What is performance testing?",
      "Explain bug lifecycle.",
    ],
  },

  "Graphic Designer": {
    easy: [
      "What is graphic design?",
      "What is typography?",
      "What is branding?",
    ],

    medium: [
      "Explain color psychology.",
      "What is visual hierarchy?",
      "How do you design logos?",
    ],

    hard: [
      "Explain minimalist design.",
      "How do you handle client feedback?",
      "Explain composition principles.",
    ],
  },

  "Content Writer": {
    easy: [
      "What is content writing?",
      "What is blogging?",
      "What is SEO writing?",
    ],

    medium: [
      "How do you research content?",
      "Explain storytelling in writing.",
      "How do you improve readability?",
    ],

    hard: [
      "Explain content strategy.",
      "How do you optimize blog posts?",
      "How do you avoid plagiarism?",
    ],
  },

  "AI Engineer": {
    easy: [
      "What is artificial intelligence?",
      "What are chatbots?",
      "What is generative AI?",
    ],

    medium: [
      "What are LLMs?",
      "Explain prompt engineering.",
      "What is fine-tuning?",
    ],

    hard: [
      "Explain vector databases.",
      "What is reinforcement learning?",
      "Explain AI ethics.",
    ],
  },
};

module.exports = questionBank;