
module.exports = function(configData) {

  let schedule = {}

  schedule.weeks = [
    {weekNum: 1,
    lectureTopic:
        "Unit info, security concepts",
    workshopTopic: "*No labs this week*",
    reading:
      `
      - Kohnfelder chaps 1--3 (Foundations, Threats and Mitigations)
      `,
    assessmentDetails: ""
    },

    {weekNum: 2,
    lectureTopic:
      "Memory and arithmetic introduction",
    workshopTopic:
      "Linux C development environment",
    reading:
      `- Kohnfelder chap 9 (Low-level coding flaws)
      `,
    assessmentDetails: ' ',
    },


    {weekNum: 3,
    lectureTopic:
      "Memory and arithmetic errors",
    workshopTopic:
        "Static and dynamic analysis tools",
    reading:
      `- Kohnfelder chap 9 (Low-level coding flaws)
      `,
    assessmentDetails: "[Week 3 quiz](https://cits3007.github.io/assessment/#week-3-quiz) (deadline Sun 11:59pm)"
    },


    {weekNum: 4,
    lectureTopic:
        "Inter-process communication (IPC) introduction",
    workshopTopic:
      `<span style="color: #696969;">***no labs***</span><br style="display: block; margin: 0.5em; content: ' '; line-height: 12px;">
       <span style="color: #696969;">PROSH (Wed 17 Aug)</span> 
      `,
    reading:
      `- Kohnfelder chaps 3 (Mitigation) and 8 (Secure programming)
      `,
    assessmentDetails: ' ',
    },

    {weekNum: 5,
    lectureTopic:
      `Input validation and IPC security`,
    workshopTopic:
      "Memory and arithmetic errors",
    reading:
      `- Kohnfelder chaps 10 (Untrusted input) and 11 (Web security)
      `,
    assessmentDetails: ' ',
    },

    {weekNum: 6,
    lectureTopic:
      "Concurrency and resources introduction",
    workshopTopic:
      "Input validation and IPC",
    reading:
      `- Kohnfelder chaps 3 (Mitigation) and 8 (Secure programming)
      `,
    assessmentDetails: 'Test design exercise, due Sun 11:59 pm',
    },

    {weekNum: null,
    lectureTopic:
      `<span style="color: #696969;">***no class -- non-teaching week***</span>`,
    workshopTopic: "",
    reading: "",
    assessmentDetails: '',
    },

    {weekNum: 7,
    lectureTopic:
      "Race conditions and secure file operations",
    workshopTopic:
      'Multi-language analysis tools',
      // sonarqube
    reading:
      `- Kohnfelder chaps 3 (Mitigation) and 8 (Secure programming)
      `,
    assessmentDetails: '',
    },


    {weekNum: 8,
      lectureTopic:
        `Cryptography introduction`,
      workshopTopic:
        `Fuzzing`,
      reading:
      `- Kohnfelder chap 5 (Cryptography)
      `,
      assessmentDetails: ' ',
    },

    {weekNum: 9,
    lectureTopic:
        `Cryptography best practices`,
    workshopTopic:
      `<span style="color: #696969;">***Mon 26 Sept -- Queens B/Day: monday lab students attend Wednesday labs***</span><br style="display: block; margin: 0.5em; content: ' '; line-height: 12px;">
       Concurrency and resources 
      `,
    reading:
      `- Kohnfelder chap 5 (Cryptography)
      `,
    assessmentDetails: 'TBA',
    },

    {weekNum: 10,
    lectureTopic:
        `Secure software development introduction`,
    workshopTopic:
          'Race conditions and secure file operations',
    reading:
      `- Kohnfelder chaps 6--7 (Secure design, Security design reviews),
         12 (Security testing)
      `,
    assessmentDetails: ' ',
    },

    {weekNum: 11,
    lectureTopic:
        `Secure development best practices`,
    workshopTopic:
          'Cryptography',
    reading:
      `- Kohnfelder chaps 6--7 (Secure design, Security design reviews),
         13 (Secure development best practices)
      `,
    assessmentDetails: "Project due",
    },

    {weekNum: 12,
    lectureTopic:
        "revision",
    workshopTopic:
        "no labs",
    reading: ' ',
    assessmentDetails: '',
    },

  ]

  // add dates for start of week
  const startDate = new Date(2022,06,25) // Monday 25 July, 2022
  let dt = new Date(startDate);
  for (let i=0; i < schedule.weeks.length; i+=1) {
    schedule.weeks[i].date = new Date(dt);
    dt.setDate( dt.getDate() + 7 );
  }
  return schedule;

}
