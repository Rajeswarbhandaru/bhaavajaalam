// scenarios-data.js
// Bhāva Tech — Life Strategist
// All scenario data embedded to fix CORS error on file:// protocol, Electron, and Capacitor.
// Add this script BEFORE scenario-loader.js in index.html:
//   <script src="data/scenarios-data.js"></script>
//   <script src="js/scenario-loader.js"></script>

window.ScenariosData = {
  level1: [
  {
    "id": "ls-01-001",
    "meta": {
      "title": "Forgot Homework",
      "level": 1,
      "theme": "everyday",
      "duration": "2 min",
      "difficulty": 1,
      "tags": [
        "school",
        "honesty",
        "planning"
      ]
    },
    "intro": "You reach school and suddenly remember your homework is still at home.",
    "objective": "Handle the situation wisely before class starts.",
    "resources": {
      "money": 20,
      "time": 10,
      "energy": 80,
      "trust": 60,
      "knowledge": 65,
      "confidence": 55,
      "health": 90
    },
    "relationships": {
      "parents": 70,
      "friends": 60,
      "teacher": 50
    },
    "nodes": [
      {
        "id": "intro",
        "type": "story",
        "text": "You reach school and suddenly remember your homework is still at home.",
        "next": "decision-1"
      },
      {
        "id": "decision-1",
        "type": "decision",
        "text": "Handle the situation wisely before class starts.",
        "choices": [
          {
            "id": "truth",
            "title": "Tell the truth",
            "description": "Explain honestly to the teacher.",
            "risk": "low",
            "reward": "medium",
            "effects": {
              "resources": {
                "confidence": 8,
                "trust": 10,
                "time": -1
              },
              "relationships": {
                "teacher": 12
              },
              "hidden": {
                "ethics": 12,
                "planning": 1,
                "risk_management": 6
              }
            },
            "next": "ending"
          },
          {
            "id": "run_home",
            "title": "Run back home",
            "description": "Try to get it before class fully begins.",
            "risk": "high",
            "reward": "medium",
            "effects": {
              "resources": {
                "energy": -20,
                "time": -7,
                "health": -3
              },
              "relationships": {},
              "hidden": {
                "adaptability": 7,
                "risk_management": 2,
                "planning": -4
              }
            },
            "next": "ending"
          },
          {
            "id": "copy_friend",
            "title": "Copy from a friend",
            "description": "Finish it quickly before submission.",
            "risk": "medium",
            "reward": "low",
            "effects": {
              "resources": {
                "confidence": -6,
                "trust": -8
              },
              "relationships": {
                "friends": -8,
                "teacher": -5
              },
              "hidden": {
                "ethics": -15,
                "risk_management": -4
              }
            },
            "next": "ending"
          }
        ]
      },
      {
        "id": "ending",
        "type": "ending",
        "text": "The situation resolves. Some lessons are learned.",
        "reflection": [
          "How could planning the previous night change this day?",
          "Does honesty help in the long term even when it hurts now?"
        ]
      }
    ]
  },
  {
    "id": "ls-01-002",
    "meta": {
      "title": "Lost Pencil",
      "level": 1,
      "theme": "everyday",
      "duration": "2 min",
      "difficulty": 1,
      "tags": [
        "resource",
        "friendship",
        "responsibility"
      ]
    },
    "intro": "Your pencil is missing during a class test.",
    "objective": "Find a solution without creating a bigger problem.",
    "resources": {
      "money": 10,
      "time": 6,
      "energy": 75,
      "trust": 55,
      "knowledge": 70,
      "confidence": 52,
      "health": 95
    },
    "relationships": {
      "parents": 65,
      "friends": 62,
      "teacher": 54
    },
    "nodes": [
      {
        "id": "intro",
        "type": "story",
        "text": "Your pencil is missing during a class test.",
        "next": "decision-1"
      },
      {
        "id": "decision-1",
        "type": "decision",
        "text": "Find a solution without creating a bigger problem.",
        "choices": [
          {
            "id": "borrow_politely",
            "title": "Borrow politely",
            "description": "Ask a classmate for help respectfully.",
            "risk": "low",
            "reward": "medium",
            "effects": {
              "resources": {
                "confidence": 5,
                "time": -1
              },
              "relationships": {
                "friends": 8
              },
              "hidden": {
                "leadership": 3,
                "ethics": 6,
                "adaptability": 5
              }
            },
            "next": "ending"
          },
          {
            "id": "tell_teacher",
            "title": "Inform the teacher",
            "description": "Request a temporary pencil from school supplies.",
            "risk": "low",
            "reward": "medium",
            "effects": {
              "resources": {
                "trust": 7,
                "confidence": 4
              },
              "relationships": {
                "teacher": 10
              },
              "hidden": {
                "ethics": 7,
                "risk_management": 6
              }
            },
            "next": "ending"
          },
          {
            "id": "take_without_asking",
            "title": "Use one without asking",
            "description": "Pick a spare pencil from a nearby desk.",
            "risk": "high",
            "reward": "low",
            "effects": {
              "resources": {
                "trust": -10,
                "confidence": -4
              },
              "relationships": {
                "friends": -10,
                "teacher": -4
              },
              "hidden": {
                "ethics": -14,
                "risk_management": -6
              }
            },
            "next": "ending"
          }
        ]
      },
      {
        "id": "ending",
        "type": "ending",
        "text": "The situation resolves. Some lessons are learned.",
        "reflection": [
          "What is the smart difference between urgent action and careless action?",
          "Why do small respectful actions matter?"
        ]
      }
    ]
  },
  {
    "id": "ls-01-003",
    "meta": {
      "title": "Late to School",
      "level": 1,
      "theme": "everyday",
      "duration": "2 min",
      "difficulty": 1,
      "tags": [
        "time",
        "honesty",
        "routine"
      ]
    },
    "intro": "You are late and the school gate is about to close.",
    "objective": "Choose the response that protects both today and tomorrow.",
    "resources": {
      "money": 15,
      "time": 5,
      "energy": 70,
      "trust": 58,
      "knowledge": 68,
      "confidence": 50,
      "health": 92
    },
    "relationships": {
      "parents": 60,
      "friends": 60,
      "teacher": 55
    },
    "nodes": [
      {
        "id": "intro",
        "type": "story",
        "text": "You are late and the school gate is about to close.",
        "next": "decision-1"
      },
      {
        "id": "decision-1",
        "type": "decision",
        "text": "Choose the response that protects both today and tomorrow.",
        "choices": [
          {
            "id": "accept_responsibility",
            "title": "Accept responsibility",
            "description": "Apologize and explain briefly.",
            "risk": "low",
            "reward": "medium",
            "effects": {
              "resources": {
                "trust": 8,
                "confidence": 6
              },
              "relationships": {
                "teacher": 10
              },
              "hidden": {
                "ethics": 10,
                "planning": 2
              }
            },
            "next": "ending"
          },
          {
            "id": "blame_traffic",
            "title": "Blame the traffic",
            "description": "Use an excuse to avoid trouble.",
            "risk": "medium",
            "reward": "low",
            "effects": {
              "resources": {
                "trust": -7,
                "confidence": -2
              },
              "relationships": {
                "teacher": -5
              },
              "hidden": {
                "ethics": -9,
                "risk_management": -3
              }
            },
            "next": "ending"
          },
          {
            "id": "jump_side_gate",
            "title": "Sneak through a side gate",
            "description": "Try to get in unseen.",
            "risk": "high",
            "reward": "low",
            "effects": {
              "resources": {
                "health": -4,
                "confidence": -6
              },
              "relationships": {
                "teacher": -8
              },
              "hidden": {
                "risk_management": -10,
                "ethics": -8
              }
            },
            "next": "ending"
          }
        ]
      },
      {
        "id": "ending",
        "type": "ending",
        "text": "The situation resolves. Some lessons are learned.",
        "reflection": [
          "Which choice protects your reputation over time?",
          "What morning habit would prevent this?"
        ]
      }
    ]
  },
  {
    "id": "ls-01-004",
    "meta": {
      "title": "Dog Chasing",
      "level": 1,
      "theme": "everyday",
      "duration": "2 min",
      "difficulty": 1,
      "tags": [
        "safety",
        "calm",
        "prediction"
      ]
    },
    "intro": "A dog starts barking and running toward you on the road.",
    "objective": "Stay safe without making the situation worse.",
    "resources": {
      "money": 12,
      "time": 4,
      "energy": 72,
      "trust": 55,
      "knowledge": 62,
      "confidence": 53,
      "health": 96
    },
    "relationships": {
      "parents": 66,
      "friends": 59,
      "teacher": 50
    },
    "nodes": [
      {
        "id": "intro",
        "type": "story",
        "text": "A dog starts barking and running toward you on the road.",
        "next": "decision-1"
      },
      {
        "id": "decision-1",
        "type": "decision",
        "text": "Stay safe without making the situation worse.",
        "choices": [
          {
            "id": "stay_calm",
            "title": "Stay calm and step back slowly",
            "description": "Avoid sudden movements.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "confidence": 7,
                "health": 1
              },
              "relationships": {},
              "hidden": {
                "prediction": 8,
                "risk_management": 10,
                "patience": 6
              }
            },
            "next": "ending"
          },
          {
            "id": "run_fast",
            "title": "Run as fast as possible",
            "description": "Try to escape immediately.",
            "risk": "high",
            "reward": "low",
            "effects": {
              "resources": {
                "energy": -12,
                "health": -5,
                "confidence": -3
              },
              "relationships": {},
              "hidden": {
                "risk_management": -7,
                "prediction": -5
              }
            },
            "next": "ending"
          },
          {
            "id": "throw_stone",
            "title": "Throw a stone",
            "description": "Try to scare the dog away.",
            "risk": "high",
            "reward": "low",
            "effects": {
              "resources": {
                "trust": -2,
                "confidence": -1
              },
              "relationships": {},
              "hidden": {
                "ethics": -5,
                "risk_management": -6
              }
            },
            "next": "ending"
          }
        ]
      },
      {
        "id": "ending",
        "type": "ending",
        "text": "The situation resolves. Some lessons are learned.",
        "reflection": [
          "Why is calm sometimes the fastest strategy?",
          "How does prediction help in danger?"
        ]
      }
    ]
  },
  {
    "id": "ls-01-005",
    "meta": {
      "title": "Rain Started",
      "level": 1,
      "theme": "everyday",
      "duration": "2 min",
      "difficulty": 1,
      "tags": [
        "weather",
        "resource",
        "adaptability"
      ]
    },
    "intro": "Rain starts suddenly while you are walking home with books.",
    "objective": "Protect yourself and your belongings intelligently.",
    "resources": {
      "money": 25,
      "time": 8,
      "energy": 74,
      "trust": 56,
      "knowledge": 66,
      "confidence": 51,
      "health": 94
    },
    "relationships": {
      "parents": 68,
      "friends": 58,
      "teacher": 52
    },
    "nodes": [
      {
        "id": "intro",
        "type": "story",
        "text": "Rain starts suddenly while you are walking home with books.",
        "next": "decision-1"
      },
      {
        "id": "decision-1",
        "type": "decision",
        "text": "Protect yourself and your belongings intelligently.",
        "choices": [
          {
            "id": "use_bag_cover",
            "title": "Protect the books first",
            "description": "Cover books using the bag and move to shelter.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "knowledge": 5,
                "health": -1,
                "confidence": 5
              },
              "relationships": {},
              "hidden": {
                "planning": 7,
                "resource_optimization": 9,
                "prediction": 6
              }
            },
            "next": "ending"
          },
          {
            "id": "wait_shop",
            "title": "Wait under a shop shade",
            "description": "Pause and restart once rain slows.",
            "risk": "low",
            "reward": "medium",
            "effects": {
              "resources": {
                "time": -4,
                "health": 2
              },
              "relationships": {},
              "hidden": {
                "patience": 8,
                "risk_management": 6
              }
            },
            "next": "ending"
          },
          {
            "id": "run_home_rain",
            "title": "Run home in the rain",
            "description": "Rush without planning.",
            "risk": "medium",
            "reward": "low",
            "effects": {
              "resources": {
                "energy": -10,
                "health": -6
              },
              "relationships": {},
              "hidden": {
                "risk_management": -3,
                "adaptability": 2
              }
            },
            "next": "ending"
          }
        ]
      },
      {
        "id": "ending",
        "type": "ending",
        "text": "The situation resolves. Some lessons are learned.",
        "reflection": [
          "What should you carry during rainy days?",
          "How do you balance time and protection?"
        ]
      }
    ]
  },
  {
    "id": "ls-01-006",
    "meta": {
      "title": "Bus Missed",
      "level": 1,
      "theme": "everyday",
      "duration": "2 min",
      "difficulty": 1,
      "tags": [
        "transport",
        "safety",
        "communication"
      ]
    },
    "intro": "You miss the school bus and now need a safe backup plan.",
    "objective": "Reach school or return home using a trusted decision.",
    "resources": {
      "money": 30,
      "time": 12,
      "energy": 71,
      "trust": 60,
      "knowledge": 64,
      "confidence": 54,
      "health": 95
    },
    "relationships": {
      "parents": 72,
      "friends": 55,
      "teacher": 51
    },
    "nodes": [
      {
        "id": "intro",
        "type": "story",
        "text": "You miss the school bus and now need a safe backup plan.",
        "next": "decision-1"
      },
      {
        "id": "decision-1",
        "type": "decision",
        "text": "Reach school or return home using a trusted decision.",
        "choices": [
          {
            "id": "call_parent",
            "title": "Call a parent",
            "description": "Inform them and ask for the safest next step.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "trust": 8,
                "confidence": 4
              },
              "relationships": {
                "parents": 10
              },
              "hidden": {
                "risk_management": 10,
                "planning": 5,
                "ethics": 4
              }
            },
            "next": "ending"
          },
          {
            "id": "share_auto_friend",
            "title": "Go with a known friend",
            "description": "Travel together in a verified vehicle.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "money": -10,
                "time": -5
              },
              "relationships": {
                "friends": 7
              },
              "hidden": {
                "adaptability": 7,
                "risk_management": 5
              }
            },
            "next": "ending"
          },
          {
            "id": "go_alone_unknown",
            "title": "Go alone with a stranger",
            "description": "Take the quickest unknown ride.",
            "risk": "high",
            "reward": "low",
            "effects": {
              "resources": {
                "confidence": -8,
                "trust": -5
              },
              "relationships": {
                "parents": -8
              },
              "hidden": {
                "risk_management": -15,
                "prediction": -8
              }
            },
            "next": "ending"
          }
        ]
      },
      {
        "id": "ending",
        "type": "ending",
        "text": "The situation resolves. Some lessons are learned.",
        "reflection": [
          "What makes a backup transport option safe?",
          "Why does communication matter in emergencies?"
        ]
      }
    ]
  },
  {
    "id": "ls-01-007",
    "meta": {
      "title": "Pocket Money",
      "level": 1,
      "theme": "everyday",
      "duration": "2 min",
      "difficulty": 1,
      "tags": [
        "budget",
        "self-control",
        "planning"
      ]
    },
    "intro": "You receive pocket money for the week and want to use it well.",
    "objective": "Balance enjoyment, savings, and future needs.",
    "resources": {
      "money": 50,
      "time": 7,
      "energy": 76,
      "trust": 58,
      "knowledge": 67,
      "confidence": 56,
      "health": 96
    },
    "relationships": {
      "parents": 70,
      "friends": 57,
      "teacher": 49
    },
    "nodes": [
      {
        "id": "intro",
        "type": "story",
        "text": "You receive pocket money for the week and want to use it well.",
        "next": "decision-1"
      },
      {
        "id": "decision-1",
        "type": "decision",
        "text": "Balance enjoyment, savings, and future needs.",
        "choices": [
          {
            "id": "split_budget",
            "title": "Split into spend-save-help",
            "description": "Use a simple budget plan.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "money": 5,
                "confidence": 6
              },
              "relationships": {
                "parents": 5
              },
              "hidden": {
                "planning": 12,
                "resource_optimization": 10,
                "patience": 8
              }
            },
            "next": "ending"
          },
          {
            "id": "spend_fun",
            "title": "Spend most on fun today",
            "description": "Enjoy now and think later.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "money": -25,
                "confidence": 2
              },
              "relationships": {},
              "hidden": {
                "patience": -7,
                "resource_optimization": -8
              }
            },
            "next": "ending"
          },
          {
            "id": "lend_all",
            "title": "Lend almost all to a friend",
            "description": "Help emotionally without a plan.",
            "risk": "medium",
            "reward": "low",
            "effects": {
              "resources": {
                "money": -30,
                "trust": 2
              },
              "relationships": {
                "friends": 6
              },
              "hidden": {
                "ethics": 5,
                "planning": -6,
                "resource_optimization": -10
              }
            },
            "next": "ending"
          }
        ]
      },
      {
        "id": "ending",
        "type": "ending",
        "text": "The situation resolves. Some lessons are learned.",
        "reflection": [
          "Why is balance smarter than pure saving or pure spending?",
          "How can a child start budgeting early?"
        ]
      }
    ]
  },
  {
    "id": "ls-01-008",
    "meta": {
      "title": "Broken Toy",
      "level": 1,
      "theme": "everyday",
      "duration": "2 min",
      "difficulty": 1,
      "tags": [
        "ownership",
        "repair",
        "honesty"
      ]
    },
    "intro": "You accidentally break a friend's toy while playing.",
    "objective": "Respond in a way that protects trust and fairness.",
    "resources": {
      "money": 35,
      "time": 6,
      "energy": 73,
      "trust": 61,
      "knowledge": 63,
      "confidence": 50,
      "health": 96
    },
    "relationships": {
      "parents": 67,
      "friends": 64,
      "teacher": 50
    },
    "nodes": [
      {
        "id": "intro",
        "type": "story",
        "text": "You accidentally break a friend's toy while playing.",
        "next": "decision-1"
      },
      {
        "id": "decision-1",
        "type": "decision",
        "text": "Respond in a way that protects trust and fairness.",
        "choices": [
          {
            "id": "admit_repair",
            "title": "Admit and offer repair",
            "description": "Be honest and try to fix or replace it.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "money": -10,
                "trust": 10,
                "confidence": 7
              },
              "relationships": {
                "friends": 12
              },
              "hidden": {
                "ethics": 12,
                "leadership": 4,
                "resource_optimization": 4
              }
            },
            "next": "ending"
          },
          {
            "id": "hide_damage",
            "title": "Hide the damage",
            "description": "Put it back and hope nobody notices.",
            "risk": "high",
            "reward": "low",
            "effects": {
              "resources": {
                "trust": -12,
                "confidence": -5
              },
              "relationships": {
                "friends": -10
              },
              "hidden": {
                "ethics": -15,
                "prediction": -4
              }
            },
            "next": "ending"
          },
          {
            "id": "blame_others",
            "title": "Blame someone else",
            "description": "Try to avoid consequences by lying.",
            "risk": "high",
            "reward": "low",
            "effects": {
              "resources": {
                "trust": -15,
                "confidence": -7
              },
              "relationships": {
                "friends": -14
              },
              "hidden": {
                "ethics": -18,
                "leadership": -6
              }
            },
            "next": "ending"
          }
        ]
      },
      {
        "id": "ending",
        "type": "ending",
        "text": "The situation resolves. Some lessons are learned.",
        "reflection": [
          "Why is repair better than hiding?",
          "How does trust break and rebuild?"
        ]
      }
    ]
  },
  {
    "id": "ls-01-009",
    "meta": {
      "title": "Argument with Friend",
      "level": 1,
      "theme": "everyday",
      "duration": "3 min",
      "difficulty": 1,
      "tags": [
        "emotion",
        "friendship",
        "conflict"
      ]
    },
    "intro": "A friend says something hurtful during a game and both of you get angry.",
    "objective": "Protect self-respect without damaging the friendship unnecessarily.",
    "resources": {
      "money": 15,
      "time": 7,
      "energy": 69,
      "trust": 57,
      "knowledge": 65,
      "confidence": 53,
      "health": 97
    },
    "relationships": {
      "parents": 65,
      "friends": 66,
      "teacher": 52
    },
    "nodes": [
      {
        "id": "intro",
        "type": "story",
        "text": "A friend says something hurtful during a game and both of you get angry.",
        "next": "decision-1"
      },
      {
        "id": "decision-1",
        "type": "decision",
        "text": "Protect self-respect without damaging the friendship unnecessarily.",
        "choices": [
          {
            "id": "cool_talk",
            "title": "Pause and talk later",
            "description": "Calm down first, then discuss clearly.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "confidence": 6,
                "trust": 6
              },
              "relationships": {
                "friends": 10
              },
              "hidden": {
                "patience": 10,
                "ethics": 8,
                "leadership": 5
              }
            },
            "next": "ending"
          },
          {
            "id": "shout_back",
            "title": "Shout back immediately",
            "description": "Win the moment emotionally.",
            "risk": "medium",
            "reward": "low",
            "effects": {
              "resources": {
                "energy": -8,
                "confidence": -3
              },
              "relationships": {
                "friends": -8
              },
              "hidden": {
                "patience": -8,
                "risk_management": -4
              }
            },
            "next": "ending"
          },
          {
            "id": "leave_group",
            "title": "Walk away permanently",
            "description": "End the friendship without clarity.",
            "risk": "medium",
            "reward": "low",
            "effects": {
              "resources": {
                "trust": -4,
                "confidence": -2
              },
              "relationships": {
                "friends": -10
              },
              "hidden": {
                "adaptability": -3,
                "leadership": -4
              }
            },
            "next": "ending"
          }
        ]
      },
      {
        "id": "ending",
        "type": "ending",
        "text": "The situation resolves. Some lessons are learned.",
        "reflection": [
          "How is calm different from weakness?",
          "When should a conversation happen after conflict?"
        ]
      }
    ]
  },
  {
    "id": "ls-01-010",
    "meta": {
      "title": "Forgot Water Bottle",
      "level": 1,
      "theme": "everyday",
      "duration": "2 min",
      "difficulty": 1,
      "tags": [
        "health",
        "planning",
        "resource"
      ]
    },
    "intro": "You realize you forgot your water bottle on a hot day at school.",
    "objective": "Stay healthy and solve the problem responsibly.",
    "resources": {
      "money": 20,
      "time": 6,
      "energy": 68,
      "trust": 58,
      "knowledge": 64,
      "confidence": 52,
      "health": 90
    },
    "relationships": {
      "parents": 66,
      "friends": 61,
      "teacher": 53
    },
    "nodes": [
      {
        "id": "intro",
        "type": "story",
        "text": "You realize you forgot your water bottle on a hot day at school.",
        "next": "decision-1"
      },
      {
        "id": "decision-1",
        "type": "decision",
        "text": "Stay healthy and solve the problem responsibly.",
        "choices": [
          {
            "id": "use_school_water",
            "title": "Refill from safe school water",
            "description": "Use the available clean source.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "health": 5,
                "confidence": 4
              },
              "relationships": {},
              "hidden": {
                "resource_optimization": 10,
                "planning": 4
              }
            },
            "next": "ending"
          },
          {
            "id": "share_friend",
            "title": "Share with a friend carefully",
            "description": "Use small portions until lunch.",
            "risk": "low",
            "reward": "medium",
            "effects": {
              "resources": {
                "health": 2,
                "trust": 3
              },
              "relationships": {
                "friends": 6
              },
              "hidden": {
                "adaptability": 6,
                "ethics": 4
              }
            },
            "next": "ending"
          },
          {
            "id": "ignore_thirst",
            "title": "Ignore it till the end",
            "description": "Do nothing and keep going.",
            "risk": "medium",
            "reward": "low",
            "effects": {
              "resources": {
                "health": -8,
                "energy": -5
              },
              "relationships": {},
              "hidden": {
                "prediction": -6,
                "risk_management": -5
              }
            },
            "next": "ending"
          }
        ]
      },
      {
        "id": "ending",
        "type": "ending",
        "text": "The situation resolves. Some lessons are learned.",
        "reflection": [
          "Why is prevention easier than emergency solving?",
          "What daily checklist could help?"
        ]
      }
    ]
  },
  {
    "id": "ls-01-011",
    "meta": {
      "title": "Library Book Due",
      "level": 1,
      "theme": "everyday",
      "duration": "3 min",
      "difficulty": 1,
      "tags": [
        "responsibility",
        "time",
        "communication"
      ]
    },
    "intro": "A library book is due today, but you are not finished reading it.",
    "objective": "Decide how to respect the system and your own learning.",
    "resources": {
      "money": 18,
      "time": 9,
      "energy": 75,
      "trust": 59,
      "knowledge": 72,
      "confidence": 53,
      "health": 97
    },
    "relationships": {
      "parents": 65,
      "friends": 55,
      "teacher": 54
    },
    "nodes": [
      {
        "id": "intro",
        "type": "story",
        "text": "A library book is due today, but you are not finished reading it.",
        "next": "decision-1"
      },
      {
        "id": "decision-1",
        "type": "decision",
        "text": "Decide how to respect the system and your own learning.",
        "choices": [
          {
            "id": "renew_book",
            "title": "Ask to renew it",
            "description": "Communicate before the deadline passes.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "knowledge": 4,
                "trust": 6
              },
              "relationships": {
                "teacher": 5
              },
              "hidden": {
                "planning": 9,
                "ethics": 8,
                "resource_optimization": 5
              }
            },
            "next": "ending"
          },
          {
            "id": "return_on_time",
            "title": "Return it on time",
            "description": "Respect the shared resource system.",
            "risk": "low",
            "reward": "medium",
            "effects": {
              "resources": {
                "trust": 5,
                "knowledge": -2
              },
              "relationships": {},
              "hidden": {
                "ethics": 8,
                "patience": 4
              }
            },
            "next": "ending"
          },
          {
            "id": "keep_silent",
            "title": "Keep it silently",
            "description": "Return it late and hope it is ignored.",
            "risk": "medium",
            "reward": "low",
            "effects": {
              "resources": {
                "trust": -8,
                "confidence": -3
              },
              "relationships": {
                "teacher": -4
              },
              "hidden": {
                "ethics": -10,
                "planning": -4
              }
            },
            "next": "ending"
          }
        ]
      },
      {
        "id": "ending",
        "type": "ending",
        "text": "The situation resolves. Some lessons are learned.",
        "reflection": [
          "Why do systems depend on individual responsibility?",
          "What was the most respectful option here?"
        ]
      }
    ]
  },
  {
    "id": "ls-01-012",
    "meta": {
      "title": "Group Project Delay",
      "level": 1,
      "theme": "everyday",
      "duration": "3 min",
      "difficulty": 1,
      "tags": [
        "teamwork",
        "leadership",
        "planning"
      ]
    },
    "intro": "Your group project is due tomorrow, but one member has not finished their part.",
    "objective": "Save the project without humiliating anyone.",
    "resources": {
      "money": 12,
      "time": 10,
      "energy": 70,
      "trust": 60,
      "knowledge": 74,
      "confidence": 57,
      "health": 97
    },
    "relationships": {
      "parents": 62,
      "friends": 63,
      "teacher": 56
    },
    "nodes": [
      {
        "id": "intro",
        "type": "story",
        "text": "Your group project is due tomorrow, but one member has not finished their part.",
        "next": "decision-1"
      },
      {
        "id": "decision-1",
        "type": "decision",
        "text": "Save the project without humiliating anyone.",
        "choices": [
          {
            "id": "redistribute_work",
            "title": "Redistribute tasks calmly",
            "description": "Help the group finish with a clear plan.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "energy": -6,
                "trust": 6,
                "confidence": 7
              },
              "relationships": {
                "friends": 8,
                "teacher": 5
              },
              "hidden": {
                "leadership": 12,
                "planning": 10,
                "adaptability": 7
              }
            },
            "next": "ending"
          },
          {
            "id": "complain_teacher",
            "title": "Complain immediately",
            "description": "Ask the teacher to handle the member.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "time": -1,
                "trust": 1
              },
              "relationships": {
                "teacher": 4,
                "friends": -4
              },
              "hidden": {
                "leadership": 1,
                "risk_management": 4,
                "ethics": 3
              }
            },
            "next": "ending"
          },
          {
            "id": "do_nothing",
            "title": "Do nothing and hope",
            "description": "Avoid conflict and wait.",
            "risk": "high",
            "reward": "low",
            "effects": {
              "resources": {
                "trust": -6,
                "confidence": -4
              },
              "relationships": {
                "friends": -5,
                "teacher": -3
              },
              "hidden": {
                "planning": -10,
                "prediction": -7
              }
            },
            "next": "ending"
          }
        ]
      },
      {
        "id": "ending",
        "type": "ending",
        "text": "The situation resolves. Some lessons are learned.",
        "reflection": [
          "What is the difference between leadership and control?",
          "How can teamwork recover after a delay?"
        ]
      }
    ]
  }
],
  level2: [
  {
    "id": "ls-02-001",
    "meta": {
      "title": "School Exhibition",
      "level": 2,
      "theme": "planner",
      "duration": "8 min",
      "difficulty": 2,
      "tags": [
        "planning",
        "teamwork",
        "budget",
        "time"
      ]
    },
    "intro": "Your class must organize a science exhibition in two weeks.",
    "objective": "Plan exhibits, budget, team roles, and handle surprises.",
    "resources": {
      "money": 500,
      "time": 14,
      "energy": 85,
      "trust": 65,
      "knowledge": 72,
      "confidence": 58,
      "health": 95
    },
    "relationships": {
      "parents": 70,
      "friends": 68,
      "teacher": 62,
      "team": 50
    },
    "nodes": [
      {
        "id": "n1",
        "type": "decision",
        "text": "First, how do you divide the team?",
        "choices": [
          {
            "id": "c1",
            "title": "Assign roles based on strengths",
            "description": "Let each member choose what they do best.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "energy": -5,
                "trust": 5
              },
              "relationships": {
                "team": 10
              },
              "hidden": {
                "leadership": 10,
                "planning": 6
              }
            },
            "next": "n2"
          },
          {
            "id": "c2",
            "title": "You decide everything",
            "description": "Take full control to save time.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "energy": -12,
                "confidence": 3
              },
              "relationships": {
                "team": -6
              },
              "hidden": {
                "leadership": -3,
                "planning": 4
              }
            },
            "next": "n2"
          },
          {
            "id": "c3",
            "title": "No roles, just work together",
            "description": "Keep it flexible and informal.",
            "risk": "medium",
            "reward": "low",
            "effects": {
              "resources": {
                "time": -3,
                "energy": -4
              },
              "relationships": {
                "team": 2
              },
              "hidden": {
                "planning": -4,
                "creativity": 5
              }
            },
            "next": "n2"
          }
        ]
      },
      {
        "id": "n2",
        "type": "decision",
        "text": "With a week left, you are over budget. What now?",
        "choices": [
          {
            "id": "c1",
            "title": "Cut non-essential items",
            "description": "Remove decorations, keep core science.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "money": 40,
                "knowledge": 5
              },
              "hidden": {
                "resource_optimization": 10,
                "risk_management": 6
              }
            },
            "next": "n3"
          },
          {
            "id": "c2",
            "title": "Ask parents for extra funds",
            "description": "Request a small contribution.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "money": 60,
                "trust": -3
              },
              "relationships": {
                "parents": -4
              },
              "hidden": {
                "ethics": -3,
                "adaptability": 4
              }
            },
            "next": "n3"
          },
          {
            "id": "c3",
            "title": "Use cheaper but risky materials",
            "description": "Compromise on quality to save.",
            "risk": "high",
            "reward": "low",
            "effects": {
              "resources": {
                "money": 20,
                "knowledge": -3
              },
              "hidden": {
                "risk_management": -6,
                "ethics": -2
              }
            },
            "next": "n3"
          }
        ]
      },
      {
        "id": "n3",
        "type": "random",
        "text": "The day before, a teammate falls sick.",
        "effects": {
          "relationships": {
            "team": -5
          },
          "resources": {
            "energy": -5
          }
        },
        "next": "n4"
      },
      {
        "id": "n4",
        "type": "decision",
        "text": "One day left. How do you cover the missing work?",
        "choices": [
          {
            "id": "c1",
            "title": "Redistribute the work fairly",
            "description": "Divide tasks among remaining members.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "energy": -8,
                "confidence": 4
              },
              "relationships": {
                "team": 6
              },
              "hidden": {
                "leadership": 8,
                "adaptability": 8
              }
            },
            "next": "ending"
          },
          {
            "id": "c2",
            "title": "Simplify the exhibit",
            "description": "Reduce scope and focus on essentials.",
            "risk": "low",
            "reward": "medium",
            "effects": {
              "resources": {
                "knowledge": 2,
                "confidence": 2
              },
              "hidden": {
                "planning": 4,
                "resource_optimization": 6
              }
            },
            "next": "ending"
          },
          {
            "id": "c3",
            "title": "Ignore it and present as-is",
            "description": "Hope the missing part goes unnoticed.",
            "risk": "high",
            "reward": "low",
            "effects": {
              "resources": {
                "trust": -6
              },
              "relationships": {
                "teacher": -4
              },
              "hidden": {
                "risk_management": -8,
                "ethics": -4
              }
            },
            "next": "ending"
          }
        ]
      },
      {
        "id": "ending",
        "type": "ending",
        "text": "The exhibition is complete. The crowd learns. The team learns. You learn.",
        "reflection": [
          "How did early role choices affect the final crisis?",
          "What was the most important preparation step?"
        ]
      }
    ]
  },
  {
    "id": "ls-02-002",
    "meta": {
      "title": "Trip Planning",
      "level": 2,
      "theme": "planner",
      "duration": "7 min",
      "difficulty": 2,
      "tags": [
        "budget",
        "prediction",
        "safety",
        "time"
      ]
    },
    "intro": "You are planning a one-day educational trip with friends.",
    "objective": "Plan transport, food, budget, and a backup plan.",
    "resources": {
      "money": 800,
      "time": 10,
      "energy": 80,
      "trust": 60,
      "knowledge": 68,
      "confidence": 55,
      "health": 93
    },
    "relationships": {
      "parents": 72,
      "friends": 70,
      "teacher": 55
    },
    "nodes": [
      {
        "id": "n1",
        "type": "decision",
        "text": "Transport choice:",
        "choices": [
          {
            "id": "c1",
            "title": "Public bus with backup route",
            "description": "Cheap and reliable, with a backup plan.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "money": -120,
                "trust": 6
              },
              "hidden": {
                "planning": 8,
                "risk_management": 8
              }
            },
            "next": "n2"
          },
          {
            "id": "c2",
            "title": "Private hired vehicle",
            "description": "Comfortable but more expensive.",
            "risk": "low",
            "reward": "medium",
            "effects": {
              "resources": {
                "money": -300
              },
              "hidden": {
                "resource_optimization": -4,
                "planning": 2
              }
            },
            "next": "n2"
          },
          {
            "id": "c3",
            "title": "Cycle with friends",
            "description": "Healthy and free, but unpredictable.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "energy": -10,
                "health": 5
              },
              "hidden": {
                "adaptability": 6,
                "risk_management": 2
              }
            },
            "next": "n2"
          }
        ]
      },
      {
        "id": "n2",
        "type": "decision",
        "text": "It is hot midday. How do you manage food and hydration?",
        "choices": [
          {
            "id": "c1",
            "title": "Pre-pack meals and extra water",
            "description": "Plan ahead and carry supplies.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "money": -60,
                "health": 5,
                "energy": 3
              },
              "hidden": {
                "planning": 8,
                "resource_optimization": 6
              }
            },
            "next": "n3"
          },
          {
            "id": "c2",
            "title": "Buy food at the destination",
            "description": "Less to carry, but unpredictable cost.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "money": -150,
                "time": -2
              },
              "hidden": {
                "prediction": 3,
                "risk_management": -2
              }
            },
            "next": "n3"
          },
          {
            "id": "c3",
            "title": "Skip food to save money",
            "description": "Reduce cost, increase risk.",
            "risk": "high",
            "reward": "low",
            "effects": {
              "resources": {
                "health": -6,
                "energy": -8
              },
              "hidden": {
                "risk_management": -6,
                "ethics": -2
              }
            },
            "next": "n3"
          }
        ]
      },
      {
        "id": "n3",
        "type": "random",
        "text": "Unexpected heavy rain in the afternoon.",
        "effects": {
          "resources": {
            "time": -2,
            "energy": -4
          }
        },
        "next": "n4"
      },
      {
        "id": "n4",
        "type": "decision",
        "text": "Rain continues. What is your next move?",
        "choices": [
          {
            "id": "c1",
            "title": "Activate shelter plan",
            "description": "Move to the pre-identified covered area.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "trust": 5,
                "confidence": 5
              },
              "hidden": {
                "adaptability": 8,
                "planning": 6
              }
            },
            "next": "ending"
          },
          {
            "id": "c2",
            "title": "Shorten the trip and return",
            "description": "Safety first, cut the itinerary.",
            "risk": "low",
            "reward": "medium",
            "effects": {
              "resources": {
                "time": -1
              },
              "relationships": {
                "friends": 2
              },
              "hidden": {
                "risk_management": 6,
                "leadership": 4
              }
            },
            "next": "ending"
          },
          {
            "id": "c3",
            "title": "Continue in the rain",
            "description": "Stick to the original plan.",
            "risk": "high",
            "reward": "low",
            "effects": {
              "resources": {
                "health": -8,
                "confidence": -4
              },
              "hidden": {
                "risk_management": -8,
                "adaptability": -2
              }
            },
            "next": "ending"
          }
        ]
      },
      {
        "id": "ending",
        "type": "ending",
        "text": "You return home. Everyone is safe. Some plans changed. That is planning.",
        "reflection": [
          "Why did the backup plan matter more than the main plan?",
          "What would you pack differently next time?"
        ]
      }
    ]
  },
  {
    "id": "ls-02-003",
    "meta": {
      "title": "Garden Management",
      "level": 2,
      "theme": "planner",
      "duration": "6 min",
      "difficulty": 2,
      "tags": [
        "long-term",
        "resource",
        "patience",
        "systems"
      ]
    },
    "intro": "You are given responsibility for the school garden for one month.",
    "objective": "Balance watering, weeding, planting, and pest control.",
    "resources": {
      "money": 200,
      "time": 30,
      "energy": 78,
      "trust": 62,
      "knowledge": 70,
      "confidence": 56,
      "health": 96
    },
    "relationships": {
      "parents": 65,
      "friends": 58,
      "teacher": 64
    },
    "nodes": [
      {
        "id": "n1",
        "type": "decision",
        "text": "Week 1: How do you start?",
        "choices": [
          {
            "id": "c1",
            "title": "Observe soil and weather first",
            "description": "Study before acting.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "knowledge": 8,
                "time": -2
              },
              "hidden": {
                "planning": 8,
                "prediction": 8
              }
            },
            "next": "n2"
          },
          {
            "id": "c2",
            "title": "Plant immediately with enthusiasm",
            "description": "Start fast, fix later.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "energy": -8,
                "time": -1
              },
              "hidden": {
                "creativity": 5,
                "planning": -3
              }
            },
            "next": "n2"
          },
          {
            "id": "c3",
            "title": "Plant only what is easiest",
            "description": "Minimize effort.",
            "risk": "low",
            "reward": "low",
            "effects": {
              "resources": {
                "knowledge": -2
              },
              "hidden": {
                "patience": -3,
                "resource_optimization": -2
              }
            },
            "next": "n2"
          }
        ]
      },
      {
        "id": "n2",
        "type": "decision",
        "text": "Week 2: Pests appear. What do you do?",
        "choices": [
          {
            "id": "c1",
            "title": "Use organic neem spray",
            "description": "Safe but needs repeated application.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "money": -30,
                "time": -3
              },
              "hidden": {
                "resource_optimization": 6,
                "ethics": 6
              }
            },
            "next": "n3"
          },
          {
            "id": "c2",
            "title": "Strong chemical pesticide",
            "description": "Fast but may harm soil.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "money": -20,
                "time": -1
              },
              "hidden": {
                "ethics": -4,
                "risk_management": -4
              }
            },
            "next": "n3"
          },
          {
            "id": "c3",
            "title": "Remove infected plants only",
            "description": "Accept loss, protect the rest.",
            "risk": "low",
            "reward": "medium",
            "effects": {
              "resources": {
                "knowledge": 4
              },
              "hidden": {
                "adaptability": 6,
                "patience": 4
              }
            },
            "next": "n3"
          }
        ]
      },
      {
        "id": "n3",
        "type": "random",
        "text": "A heatwave hits in Week 3. Water supply is limited.",
        "effects": {
          "resources": {
            "time": -3,
            "energy": -5
          }
        },
        "next": "n4"
      },
      {
        "id": "n4",
        "type": "decision",
        "text": "Water is limited. How do you save the garden?",
        "choices": [
          {
            "id": "c1",
            "title": "Water only critical plants",
            "description": "Prioritize survival over growth.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "time": -4,
                "knowledge": 4
              },
              "hidden": {
                "resource_optimization": 10,
                "prediction": 6
              }
            },
            "next": "ending"
          },
          {
            "id": "c2",
            "title": "Request school water tank",
            "description": "Ask for institutional support.",
            "risk": "low",
            "reward": "medium",
            "effects": {
              "resources": {
                "trust": 4
              },
              "relationships": {
                "teacher": 6
              },
              "hidden": {
                "leadership": 6,
                "adaptability": 4
              }
            },
            "next": "ending"
          },
          {
            "id": "c3",
            "title": "Water everything equally",
            "description": "Equal share, but may not be enough.",
            "risk": "high",
            "reward": "low",
            "effects": {
              "resources": {
                "energy": -6
              },
              "hidden": {
                "resource_optimization": -6,
                "planning": -2
              }
            },
            "next": "ending"
          }
        ]
      },
      {
        "id": "ending",
        "type": "ending",
        "text": "The garden survives. Some plants thrive. Some fade. You learned what a month teaches.",
        "reflection": [
          "How did early observation help in the crisis?",
          "What is the cost of quick fixes?"
        ]
      }
    ]
  },
  {
    "id": "ls-02-004",
    "meta": {
      "title": "Monthly Budget",
      "level": 2,
      "theme": "planner",
      "duration": "5 min",
      "difficulty": 2,
      "tags": [
        "budget",
        "saving",
        "tradeoff",
        "math"
      ]
    },
    "intro": "You have a monthly allowance and real expenses ahead.",
    "objective": "Survive the month with health, studies, and friendships intact.",
    "resources": {
      "money": 1000,
      "time": 30,
      "energy": 82,
      "trust": 60,
      "knowledge": 74,
      "confidence": 58,
      "health": 98
    },
    "relationships": {
      "parents": 70,
      "friends": 65,
      "teacher": 54
    },
    "nodes": [
      {
        "id": "n1",
        "type": "decision",
        "text": "Week 1: You receive allowance. First action?",
        "choices": [
          {
            "id": "c1",
            "title": "Divide into needs, savings, wants",
            "description": "Classic budget split first.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "money": 0,
                "confidence": 6
              },
              "hidden": {
                "planning": 10,
                "resource_optimization": 10,
                "patience": 6
              }
            },
            "next": "n2"
          },
          {
            "id": "c2",
            "title": "Spend a little on celebration first",
            "description": "Reward yourself, then plan.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "money": -120,
                "energy": 4
              },
              "hidden": {
                "patience": -4,
                "resource_optimization": -4
              }
            },
            "next": "n2"
          },
          {
            "id": "c3",
            "title": "Keep everything in pocket and decide daily",
            "description": "No plan, reactive spending.",
            "risk": "medium",
            "reward": "low",
            "effects": {
              "resources": {
                "money": -50
              },
              "hidden": {
                "planning": -6,
                "risk_management": -3
              }
            },
            "next": "n2"
          }
        ]
      },
      {
        "id": "n2",
        "type": "decision",
        "text": "Mid-month: A friend asks for a loan. What do you do?",
        "choices": [
          {
            "id": "c1",
            "title": "Lend a small, safe amount",
            "description": "Help without risking your survival.",
            "risk": "low",
            "reward": "medium",
            "effects": {
              "resources": {
                "money": -60,
                "trust": 4
              },
              "relationships": {
                "friends": 8
              },
              "hidden": {
                "ethics": 6,
                "resource_optimization": 4
              }
            },
            "next": "n3"
          },
          {
            "id": "c2",
            "title": "Lend whatever is asked",
            "description": "Be generous, but endanger yourself.",
            "risk": "high",
            "reward": "low",
            "effects": {
              "resources": {
                "money": -200,
                "trust": -3
              },
              "relationships": {
                "friends": 4
              },
              "hidden": {
                "ethics": 3,
                "risk_management": -8
              }
            },
            "next": "n3"
          },
          {
            "id": "c3",
            "title": "Decline politely",
            "description": "Protect your budget honestly.",
            "risk": "low",
            "reward": "medium",
            "effects": {
              "resources": {
                "trust": 2
              },
              "relationships": {
                "friends": -2
              },
              "hidden": {
                "ethics": 4,
                "leadership": 2
              }
            },
            "next": "n3"
          }
        ]
      },
      {
        "id": "n3",
        "type": "random",
        "text": "Unexpected: School fees notice arrives for a small activity.",
        "effects": {
          "resources": {
            "money": -80,
            "time": -1
          }
        },
        "next": "n4"
      },
      {
        "id": "n4",
        "type": "decision",
        "text": "Last week: You are short. How do you finish?",
        "choices": [
          {
            "id": "c1",
            "title": "Cut non-essentials strictly",
            "description": "Eat simple, skip entertainment.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "money": 40,
                "health": -2
              },
              "hidden": {
                "resource_optimization": 8,
                "planning": 4
              }
            },
            "next": "ending"
          },
          {
            "id": "c2",
            "title": "Ask parents for extra",
            "description": "Request a bailout.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "money": 100,
                "trust": -5
              },
              "relationships": {
                "parents": -4
              },
              "hidden": {
                "adaptability": 4,
                "ethics": -2
              }
            },
            "next": "ending"
          },
          {
            "id": "c3",
            "title": "Skip lunch for three days",
            "description": "Save money, harm health.",
            "risk": "high",
            "reward": "low",
            "effects": {
              "resources": {
                "money": 60,
                "health": -8,
                "energy": -6
              },
              "hidden": {
                "risk_management": -8,
                "ethics": -3
              }
            },
            "next": "ending"
          }
        ]
      },
      {
        "id": "ending",
        "type": "ending",
        "text": "The month ends. Some money remains. Some lessons remain.",
        "reflection": [
          "What was the most important budget decision?",
          "How does planning early reduce crisis?"
        ]
      }
    ]
  },
  {
    "id": "ls-02-005",
    "meta": {
      "title": "Festival Preparation",
      "level": 2,
      "theme": "planner",
      "duration": "8 min",
      "difficulty": 2,
      "tags": [
        "coordination",
        "culture",
        "budget",
        "teamwork"
      ]
    },
    "intro": "Your family is hosting a small festival event at home.",
    "objective": "Coordinate tasks, budget, guests, and handle last-minute changes.",
    "resources": {
      "money": 1500,
      "time": 7,
      "energy": 80,
      "trust": 66,
      "knowledge": 68,
      "confidence": 60,
      "health": 95
    },
    "relationships": {
      "parents": 75,
      "friends": 62,
      "neighbors": 55,
      "teacher": 50
    },
    "nodes": [
      {
        "id": "n1",
        "type": "decision",
        "text": "Three days before: What do you prepare first?",
        "choices": [
          {
            "id": "c1",
            "title": "Guest list and food plan",
            "description": "Plan who comes and what is cooked.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "knowledge": 6,
                "confidence": 4
              },
              "hidden": {
                "planning": 10,
                "resource_optimization": 6
              }
            },
            "next": "n2"
          },
          {
            "id": "c2",
            "title": "Decorations and music",
            "description": "Focus on atmosphere first.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "money": -200,
                "energy": -6
              },
              "hidden": {
                "creativity": 8,
                "planning": -2
              }
            },
            "next": "n2"
          },
          {
            "id": "c3",
            "title": "Wait and do everything on the day",
            "description": "No preparation, maximum effort later.",
            "risk": "high",
            "reward": "low",
            "effects": {
              "resources": {
                "energy": -10,
                "confidence": -3
              },
              "hidden": {
                "planning": -8,
                "risk_management": -6
              }
            },
            "next": "n2"
          }
        ]
      },
      {
        "id": "n2",
        "type": "decision",
        "text": "Day before: A key ingredient is not available. What now?",
        "choices": [
          {
            "id": "c1",
            "title": "Substitute smartly",
            "description": "Use an alternative dish with available items.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "money": -30,
                "knowledge": 4
              },
              "hidden": {
                "adaptability": 8,
                "resource_optimization": 6
              }
            },
            "next": "n3"
          },
          {
            "id": "c2",
            "title": "Buy from expensive nearby store",
            "description": "Pay more for convenience.",
            "risk": "low",
            "reward": "medium",
            "effects": {
              "resources": {
                "money": -80,
                "time": -1
              },
              "hidden": {
                "risk_management": 3,
                "resource_optimization": -3
              }
            },
            "next": "n3"
          },
          {
            "id": "c3",
            "title": "Skip that dish entirely",
            "description": "Accept the menu gap.",
            "risk": "low",
            "reward": "medium",
            "effects": {
              "resources": {
                "trust": 2
              },
              "hidden": {
                "adaptability": 4,
                "patience": 3
              }
            },
            "next": "n3"
          }
        ]
      },
      {
        "id": "n3",
        "type": "random",
        "text": "Festival day: More guests arrive than expected.",
        "effects": {
          "resources": {
            "time": -2,
            "energy": -4
          }
        },
        "next": "n4"
      },
      {
        "id": "n4",
        "type": "decision",
        "text": "Extra guests are here. What do you do?",
        "choices": [
          {
            "id": "c1",
            "title": "Serve smaller portions and share joy",
            "description": "Welcome all with generosity.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "trust": 8,
                "confidence": 6
              },
              "relationships": {
                "neighbors": 8,
                "friends": 6
              },
              "hidden": {
                "leadership": 8,
                "resource_optimization": 6
              }
            },
            "next": "ending"
          },
          {
            "id": "c2",
            "title": "Order extra food quickly",
            "description": "Spend more, satisfy everyone.",
            "risk": "low",
            "reward": "medium",
            "effects": {
              "resources": {
                "money": -120,
                "time": -1
              },
              "hidden": {
                "adaptability": 5,
                "resource_optimization": -3
              }
            },
            "next": "ending"
          },
          {
            "id": "c3",
            "title": "Ask some guests to wait",
            "description": "Manage the overflow.",
            "risk": "medium",
            "reward": "low",
            "effects": {
              "resources": {
                "trust": -4
              },
              "relationships": {
                "neighbors": -4
              },
              "hidden": {
                "risk_management": -2,
                "leadership": -3
              }
            },
            "next": "ending"
          }
        ]
      },
      {
        "id": "ending",
        "type": "ending",
        "text": "The festival is complete. Music fades. Guests leave. The house is warm.",
        "reflection": [
          "How did preparation affect the unexpected guest moment?",
          "What is the real purpose of celebration?"
        ]
      }
    ]
  },
  {
    "id": "ls-02-006",
    "meta": {
      "title": "Family Shopping",
      "level": 2,
      "theme": "planner",
      "duration": "6 min",
      "difficulty": 2,
      "tags": [
        "list",
        "budget",
        "negotiation",
        "efficiency"
      ]
    },
    "intro": "You are sent to buy groceries for the family with a list and a budget.",
    "objective": "Buy everything, stay within budget, and handle store surprises.",
    "resources": {
      "money": 600,
      "time": 4,
      "energy": 78,
      "trust": 68,
      "knowledge": 66,
      "confidence": 57,
      "health": 96
    },
    "relationships": {
      "parents": 72,
      "friends": 55,
      "neighbors": 50
    },
    "nodes": [
      {
        "id": "n1",
        "type": "decision",
        "text": "At the store: Some items are more expensive than expected.",
        "choices": [
          {
            "id": "c1",
            "title": "Compare brands and choose cheaper",
            "description": "Smart substitution without losing quality.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "money": -40,
                "knowledge": 4
              },
              "hidden": {
                "resource_optimization": 10,
                "planning": 4
              }
            },
            "next": "n2"
          },
          {
            "id": "c2",
            "title": "Buy the usual brands anyway",
            "description": "Stick to familiar quality.",
            "risk": "low",
            "reward": "medium",
            "effects": {
              "resources": {
                "money": -120
              },
              "hidden": {
                "risk_management": 2,
                "resource_optimization": -4
              }
            },
            "next": "n2"
          },
          {
            "id": "c3",
            "title": "Skip some items to save",
            "description": "Come back without everything.",
            "risk": "medium",
            "reward": "low",
            "effects": {
              "resources": {
                "trust": -4
              },
              "relationships": {
                "parents": -3
              },
              "hidden": {
                "planning": -4,
                "ethics": -2
              }
            },
            "next": "n2"
          }
        ]
      },
      {
        "id": "n2",
        "type": "decision",
        "text": "You see a big discount on a non-essential item your sibling wants.",
        "choices": [
          {
            "id": "c1",
            "title": "Buy it as a gift",
            "description": "Surprise your sibling, but spend extra.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "money": -80,
                "trust": 3
              },
              "relationships": {
                "parents": 2
              },
              "hidden": {
                "ethics": 4,
                "patience": 3
              }
            },
            "next": "n3"
          },
          {
            "id": "c2",
            "title": "Stick to the list strictly",
            "description": "No impulse, stay disciplined.",
            "risk": "low",
            "reward": "medium",
            "effects": {
              "resources": {
                "trust": 5,
                "confidence": 4
              },
              "hidden": {
                "planning": 6,
                "patience": 6
              }
            },
            "next": "n3"
          },
          {
            "id": "c3",
            "title": "Buy it but ask for extra money later",
            "description": "Hide the real cost.",
            "risk": "high",
            "reward": "low",
            "effects": {
              "resources": {
                "money": -80,
                "trust": -6
              },
              "hidden": {
                "ethics": -8,
                "risk_management": -4
              }
            },
            "next": "n3"
          }
        ]
      },
      {
        "id": "n3",
        "type": "random",
        "text": "Carrying heavy bags, the handle breaks halfway.",
        "effects": {
          "resources": {
            "energy": -6,
            "time": -1
          }
        },
        "next": "n4"
      },
      {
        "id": "n4",
        "type": "decision",
        "text": "Bags are heavy and one broke. How do you reach home?",
        "choices": [
          {
            "id": "c1",
            "title": "Rest and redistribute weight",
            "description": "Take a break, then continue smartly.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "time": -1,
                "energy": -2
              },
              "hidden": {
                "adaptability": 6,
                "risk_management": 4
              }
            },
            "next": "ending"
          },
          {
            "id": "c2",
            "title": "Ask a neighbor for help",
            "description": "Use community support.",
            "risk": "low",
            "reward": "medium",
            "effects": {
              "resources": {
                "energy": 2
              },
              "relationships": {
                "neighbors": 8
              },
              "hidden": {
                "leadership": 4,
                "adaptability": 4
              }
            },
            "next": "ending"
          },
          {
            "id": "c3",
            "title": "Leave some items behind",
            "description": "Sacrifice goods to save effort.",
            "risk": "medium",
            "reward": "low",
            "effects": {
              "resources": {
                "money": -30,
                "trust": -3
              },
              "hidden": {
                "resource_optimization": -6,
                "risk_management": -3
              }
            },
            "next": "ending"
          }
        ]
      },
      {
        "id": "ending",
        "type": "ending",
        "text": "You reach home. The list is mostly complete. The family eats. You learn.",
        "reflection": [
          "When is flexibility better than strict discipline?",
          "How do surprises test preparation?"
        ]
      }
    ]
  },
  {
    "id": "ls-02-007",
    "meta": {
      "title": "Science Project",
      "level": 2,
      "theme": "planner",
      "duration": "10 min",
      "difficulty": 2,
      "tags": [
        "research",
        "build",
        "present",
        "teamwork"
      ]
    },
    "intro": "You have two weeks to build a working model for the science fair.",
    "objective": "Research, build, test, and present. Manage time and failures.",
    "resources": {
      "money": 400,
      "time": 14,
      "energy": 82,
      "trust": 60,
      "knowledge": 76,
      "confidence": 58,
      "health": 95
    },
    "relationships": {
      "parents": 68,
      "friends": 60,
      "teacher": 65,
      "team": 55
    },
    "nodes": [
      {
        "id": "n1",
        "type": "decision",
        "text": "Week 1: How do you start research?",
        "choices": [
          {
            "id": "c1",
            "title": "Library + online + mentor advice",
            "description": "Thorough multi-source research.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "knowledge": 12,
                "time": -3,
                "energy": -4
              },
              "hidden": {
                "planning": 8,
                "prediction": 8
              }
            },
            "next": "n2"
          },
          {
            "id": "c2",
            "title": "Online only, quick and fast",
            "description": "Fast but shallow.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "knowledge": 4,
                "time": -1
              },
              "hidden": {
                "planning": 2,
                "prediction": 1
              }
            },
            "next": "n2"
          },
          {
            "id": "c3",
            "title": "Skip research and start building",
            "description": "Learn while building.",
            "risk": "high",
            "reward": "low",
            "effects": {
              "resources": {
                "time": -1,
                "energy": -6
              },
              "hidden": {
                "planning": -6,
                "risk_management": -4
              }
            },
            "next": "n2"
          }
        ]
      },
      {
        "id": "n2",
        "type": "decision",
        "text": "Week 2: Your first prototype fails completely.",
        "choices": [
          {
            "id": "c1",
            "title": "Analyze failure, rebuild",
            "description": "Study what went wrong and fix it.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "knowledge": 6,
                "time": -3,
                "energy": -6
              },
              "hidden": {
                "adaptability": 8,
                "prediction": 6,
                "creativity": 4
              }
            },
            "next": "n3"
          },
          {
            "id": "c2",
            "title": "Simplify the model",
            "description": "Reduce ambition, increase reliability.",
            "risk": "low",
            "reward": "medium",
            "effects": {
              "resources": {
                "time": -1,
                "knowledge": 2
              },
              "hidden": {
                "resource_optimization": 6,
                "planning": 4
              }
            },
            "next": "n3"
          },
          {
            "id": "c3",
            "title": "Present the failed model anyway",
            "description": "Be honest about the experiment.",
            "risk": "medium",
            "reward": "low",
            "effects": {
              "resources": {
                "confidence": -4,
                "trust": 2
              },
              "relationships": {
                "teacher": 4
              },
              "hidden": {
                "ethics": 6,
                "risk_management": -2
              }
            },
            "next": "n3"
          }
        ]
      },
      {
        "id": "n3",
        "type": "random",
        "text": "The night before: Your display board tears.",
        "effects": {
          "resources": {
            "time": -2,
            "energy": -3
          }
        },
        "next": "n4"
      },
      {
        "id": "n4",
        "type": "decision",
        "text": "Display board is damaged. One night left.",
        "choices": [
          {
            "id": "c1",
            "title": "Make a simpler handmade board",
            "description": "Create a clean, minimal board.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "energy": -6,
                "time": -2
              },
              "hidden": {
                "creativity": 8,
                "adaptability": 6
              }
            },
            "next": "ending"
          },
          {
            "id": "c2",
            "title": "Use digital presentation instead",
            "description": "Adapt to a tablet-based display.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "knowledge": 4,
                "time": -1
              },
              "hidden": {
                "adaptability": 6,
                "creativity": 4
              }
            },
            "next": "ending"
          },
          {
            "id": "c3",
            "title": "Ignore the board and focus on speech",
            "description": "Talk more, display less.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "confidence": 3,
                "energy": -4
              },
              "hidden": {
                "leadership": 4,
                "risk_management": 3
              }
            },
            "next": "ending"
          }
        ]
      },
      {
        "id": "ending",
        "type": "ending",
        "text": "The fair opens. Your model works. Your board tells a story. Your voice carries it.",
        "reflection": [
          "How did failure improve the final result?",
          "What mattered more: the model or the explanation?"
        ]
      }
    ]
  },
  {
    "id": "ls-02-008",
    "meta": {
      "title": "Birthday Organization",
      "level": 2,
      "theme": "planner",
      "duration": "8 min",
      "difficulty": 2,
      "tags": [
        "guests",
        "budget",
        "activities",
        "time"
      ]
    },
    "intro": "You are organizing a surprise birthday for a close friend.",
    "objective": "Plan guest list, food, games, and keep the secret.",
    "resources": {
      "money": 700,
      "time": 5,
      "energy": 80,
      "trust": 62,
      "knowledge": 64,
      "confidence": 59,
      "health": 95
    },
    "relationships": {
      "parents": 66,
      "friends": 72,
      "neighbors": 52
    },
    "nodes": [
      {
        "id": "n1",
        "type": "decision",
        "text": "Guest list: Who do you invite?",
        "choices": [
          {
            "id": "c1",
            "title": "Close friends only",
            "description": "Small, meaningful, manageable.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "money": -120,
                "trust": 6
              },
              "relationships": {
                "friends": 10
              },
              "hidden": {
                "planning": 6,
                "resource_optimization": 6
              }
            },
            "next": "n2"
          },
          {
            "id": "c2",
            "title": "Large group, everyone",
            "description": "Big party, more complexity.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "money": -300,
                "energy": -6,
                "time": -2
              },
              "hidden": {
                "leadership": 4,
                "risk_management": -3
              }
            },
            "next": "n2"
          },
          {
            "id": "c3",
            "title": "Only family and one friend",
            "description": "Very intimate, very safe.",
            "risk": "low",
            "reward": "low",
            "effects": {
              "resources": {
                "money": -60,
                "trust": 2
              },
              "relationships": {
                "friends": -2
              },
              "hidden": {
                "ethics": 3,
                "planning": 2
              }
            },
            "next": "n2"
          }
        ]
      },
      {
        "id": "n2",
        "type": "decision",
        "text": "The friend almost discovers the plan. What do you do?",
        "choices": [
          {
            "id": "c1",
            "title": "Create a believable cover story",
            "description": "Distract with a different plan.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "knowledge": 4,
                "trust": 4
              },
              "hidden": {
                "creativity": 8,
                "prediction": 6
              }
            },
            "next": "n3"
          },
          {
            "id": "c2",
            "title": "Cancel the surprise, tell them",
            "description": "Lose the surprise, keep the event.",
            "risk": "low",
            "reward": "medium",
            "effects": {
              "resources": {
                "trust": 5,
                "confidence": 2
              },
              "hidden": {
                "ethics": 6,
                "adaptability": 3
              }
            },
            "next": "n3"
          },
          {
            "id": "c3",
            "title": "Lie completely",
            "description": "Make up an elaborate false story.",
            "risk": "high",
            "reward": "low",
            "effects": {
              "resources": {
                "trust": -6
              },
              "hidden": {
                "ethics": -10,
                "risk_management": -4
              }
            },
            "next": "n3"
          }
        ]
      },
      {
        "id": "n3",
        "type": "random",
        "text": "Party day: The cake delivery is late.",
        "effects": {
          "resources": {
            "time": -1,
            "energy": -3
          }
        },
        "next": "n4"
      },
      {
        "id": "n4",
        "type": "decision",
        "text": "Cake is late. Guests are arriving.",
        "choices": [
          {
            "id": "c1",
            "title": "Start games and activities first",
            "description": "Delay cake cutting, keep energy high.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "energy": 2,
                "confidence": 4
              },
              "hidden": {
                "adaptability": 8,
                "leadership": 6
              }
            },
            "next": "ending"
          },
          {
            "id": "c2",
            "title": "Send someone to pick it up",
            "description": "Solve the logistics problem.",
            "risk": "low",
            "reward": "medium",
            "effects": {
              "resources": {
                "money": -20,
                "time": -1
              },
              "relationships": {
                "friends": 3
              },
              "hidden": {
                "resource_optimization": 4,
                "planning": 3
              }
            },
            "next": "ending"
          },
          {
            "id": "c3",
            "title": "Wait and do nothing",
            "description": "Hope the cake arrives.",
            "risk": "medium",
            "reward": "low",
            "effects": {
              "resources": {
                "trust": -2,
                "energy": -2
              },
              "hidden": {
                "adaptability": -3,
                "planning": -2
              }
            },
            "next": "ending"
          }
        ]
      },
      {
        "id": "ending",
        "type": "ending",
        "text": "The friend is surprised. The room is warm. The secret was worth it.",
        "reflection": [
          "What was the hardest part to plan?",
          "How did secrecy change the joy?"
        ]
      }
    ]
  },
  {
    "id": "ls-02-009",
    "meta": {
      "title": "Sports Day Prep",
      "level": 2,
      "theme": "planner",
      "duration": "7 min",
      "difficulty": 2,
      "tags": [
        "practice",
        "nutrition",
        "gear",
        "health"
      ]
    },
    "intro": "You are preparing for an inter-school sports day in two weeks.",
    "objective": "Balance training, rest, diet, and equipment.",
    "resources": {
      "money": 300,
      "time": 14,
      "energy": 85,
      "trust": 60,
      "knowledge": 68,
      "confidence": 55,
      "health": 92
    },
    "relationships": {
      "parents": 70,
      "friends": 64,
      "teacher": 60
    },
    "nodes": [
      {
        "id": "n1",
        "type": "decision",
        "text": "Training plan: How do you practice?",
        "choices": [
          {
            "id": "c1",
            "title": "Structured daily practice with rest",
            "description": "Planned sessions, recovery days, balanced.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "energy": -6,
                "health": 4,
                "knowledge": 6
              },
              "hidden": {
                "planning": 10,
                "resource_optimization": 6,
                "patience": 6
              }
            },
            "next": "n2"
          },
          {
            "id": "c2",
            "title": "Practice hard every day",
            "description": "Maximum effort, no rest.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "energy": -12,
                "health": -4
              },
              "hidden": {
                "risk_management": -6,
                "patience": -4
              }
            },
            "next": "n2"
          },
          {
            "id": "c3",
            "title": "Practice only on weekends",
            "description": "Minimal but focused.",
            "risk": "medium",
            "reward": "low",
            "effects": {
              "resources": {
                "energy": -3,
                "knowledge": -2
              },
              "hidden": {
                "planning": -4,
                "prediction": -3
              }
            },
            "next": "n2"
          }
        ]
      },
      {
        "id": "n2",
        "type": "decision",
        "text": "You need better shoes but have limited budget.",
        "choices": [
          {
            "id": "c1",
            "title": "Buy quality used shoes",
            "description": "Good condition, affordable, smart.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "money": -100,
                "confidence": 5
              },
              "hidden": {
                "resource_optimization": 8,
                "planning": 4
              }
            },
            "next": "n3"
          },
          {
            "id": "c2",
            "title": "Buy new cheap shoes",
            "description": "New but low quality.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "money": -180
              },
              "hidden": {
                "resource_optimization": -2,
                "risk_management": 2
              }
            },
            "next": "n3"
          },
          {
            "id": "c3",
            "title": "Use old shoes",
            "description": "Save money, risk injury.",
            "risk": "high",
            "reward": "low",
            "effects": {
              "resources": {
                "health": -6,
                "confidence": -2
              },
              "hidden": {
                "risk_management": -6,
                "prediction": -4
              }
            },
            "next": "n3"
          }
        ]
      },
      {
        "id": "n3",
        "type": "random",
        "text": "Three days before: You catch a mild cold.",
        "effects": {
          "resources": {
            "health": -8,
            "energy": -4
          }
        },
        "next": "n4"
      },
      {
        "id": "n4",
        "type": "decision",
        "text": "You have a mild cold. Sports day is close.",
        "choices": [
          {
            "id": "c1",
            "title": "Rest and recover fully",
            "description": "Skip one practice, recover well.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "health": 6,
                "time": -1
              },
              "hidden": {
                "patience": 8,
                "risk_management": 8,
                "planning": 4
              }
            },
            "next": "ending"
          },
          {
            "id": "c2",
            "title": "Practice lightly with medicine",
            "description": "Keep moving but protect health.",
            "risk": "low",
            "reward": "medium",
            "effects": {
              "resources": {
                "money": -30,
                "health": 2,
                "energy": -3
              },
              "hidden": {
                "adaptability": 5,
                "risk_management": 4
              }
            },
            "next": "ending"
          },
          {
            "id": "c3",
            "title": "Ignore and train hard",
            "description": "Push through the illness.",
            "risk": "high",
            "reward": "low",
            "effects": {
              "resources": {
                "health": -10,
                "energy": -6
              },
              "hidden": {
                "risk_management": -10,
                "prediction": -6
              }
            },
            "next": "ending"
          }
        ]
      },
      {
        "id": "ending",
        "type": "ending",
        "text": "The sports day arrives. Your body is ready or not. Your mind is ready.",
        "reflection": [
          "What is the difference between preparation and obsession?",
          "How did rest contribute to performance?"
        ]
      }
    ]
  },
  {
    "id": "ls-02-010",
    "meta": {
      "title": "Community Clean-up",
      "level": 2,
      "theme": "planner",
      "duration": "8 min",
      "difficulty": 2,
      "tags": [
        "teamwork",
        "leadership",
        "environment",
        "systems"
      ]
    },
    "intro": "You are leading a small team to clean a local park.",
    "objective": "Organize people, tools, safety, and complete the area.",
    "resources": {
      "money": 250,
      "time": 5,
      "energy": 80,
      "trust": 65,
      "knowledge": 66,
      "confidence": 58,
      "health": 95
    },
    "relationships": {
      "parents": 68,
      "friends": 66,
      "neighbors": 58,
      "teacher": 60
    },
    "nodes": [
      {
        "id": "n1",
        "type": "decision",
        "text": "Team arrives. How do you start?",
        "choices": [
          {
            "id": "c1",
            "title": "Map the area and divide zones",
            "description": "Plan before moving.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "knowledge": 6,
                "time": -1
              },
              "relationships": {
                "team": 8
              },
              "hidden": {
                "leadership": 10,
                "planning": 8
              }
            },
            "next": "n2"
          },
          {
            "id": "c2",
            "title": "Everyone starts wherever",
            "description": "Fast start, messy execution.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "energy": -6,
                "time": -1
              },
              "relationships": {
                "team": -2
              },
              "hidden": {
                "planning": -4,
                "leadership": -2
              }
            },
            "next": "n2"
          },
          {
            "id": "c3",
            "title": "You clean alone, others watch",
            "description": "Lead by example, but isolate.",
            "risk": "medium",
            "reward": "low",
            "effects": {
              "resources": {
                "energy": -12
              },
              "relationships": {
                "friends": -4
              },
              "hidden": {
                "leadership": 2,
                "teamwork": -4
              }
            },
            "next": "n2"
          }
        ]
      },
      {
        "id": "n2",
        "type": "decision",
        "text": "Midway: Some volunteers are tired and want to quit.",
        "choices": [
          {
            "id": "c1",
            "title": "Rotate tasks and give breaks",
            "description": "Keep everyone engaged, reduce fatigue.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "energy": 2,
                "time": -1
              },
              "relationships": {
                "team": 8,
                "friends": 4
              },
              "hidden": {
                "leadership": 8,
                "resource_optimization": 6
              }
            },
            "next": "n3"
          },
          {
            "id": "c2",
            "title": "Let them leave, finish with fewer",
            "description": "Reduce team, focus on completion.",
            "risk": "low",
            "reward": "medium",
            "effects": {
              "resources": {
                "energy": -6
              },
              "hidden": {
                "adaptability": 4,
                "risk_management": 2
              }
            },
            "next": "n3"
          },
          {
            "id": "c3",
            "title": "Push them to continue",
            "description": "Force motivation, risk resentment.",
            "risk": "medium",
            "reward": "low",
            "effects": {
              "resources": {
                "trust": -4
              },
              "relationships": {
                "team": -6
              },
              "hidden": {
                "leadership": -4,
                "ethics": -3
              }
            },
            "next": "n3"
          }
        ]
      },
      {
        "id": "n3",
        "type": "random",
        "text": "You find a broken glass bottle near a child playing.",
        "effects": {
          "resources": {
            "time": -1
          },
          "relationships": {
            "neighbors": 3
          }
        },
        "next": "n4"
      },
      {
        "id": "n4",
        "type": "decision",
        "text": "Hazard found: sharp glass near children.",
        "choices": [
          {
            "id": "c1",
            "title": "Safely remove and alert everyone",
            "description": "Immediate safe action, clear communication.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "trust": 8,
                "confidence": 6
              },
              "relationships": {
                "neighbors": 10
              },
              "hidden": {
                "leadership": 8,
                "risk_management": 10,
                "ethics": 6
              }
            },
            "next": "ending"
          },
          {
            "id": "c2",
            "title": "Remove quietly without alarming",
            "description": "Calm but less educational.",
            "risk": "low",
            "reward": "medium",
            "effects": {
              "resources": {
                "trust": 4
              },
              "hidden": {
                "risk_management": 5,
                "adaptability": 3
              }
            },
            "next": "ending"
          },
          {
            "id": "c3",
            "title": "Tell someone else to handle it",
            "description": "Pass responsibility.",
            "risk": "medium",
            "reward": "low",
            "effects": {
              "resources": {
                "trust": -3
              },
              "hidden": {
                "leadership": -4,
                "ethics": -2
              }
            },
            "next": "ending"
          }
        ]
      },
      {
        "id": "ending",
        "type": "ending",
        "text": "The park is cleaner. The children are safer. The team is stronger.",
        "reflection": [
          "How did leadership show in small moments?",
          "What is the long-term effect of a clean shared space?"
        ]
      }
    ]
  }
],
  level3: [
  {
    "id": "ls-03-001",
    "meta": {
      "title": "Principal Simulator",
      "level": 3,
      "theme": "master",
      "duration": "20 min",
      "difficulty": 3,
      "tags": [
        "systems",
        "leadership",
        "budget",
        "ethics",
        "conflict"
      ]
    },
    "intro": "You are the student council president for a week. Real problems arrive daily.",
    "objective": "Balance student needs, teacher requests, budget limits, and fairness.",
    "resources": {
      "money": 5000,
      "time": 7,
      "energy": 90,
      "trust": 70,
      "knowledge": 80,
      "confidence": 65,
      "health": 95
    },
    "relationships": {
      "parents": 60,
      "friends": 55,
      "teachers": 65,
      "students": 50,
      "staff": 55
    },
    "nodes": [
      {
        "id": "n1",
        "type": "decision",
        "text": "Day 1: Students want longer break. Teachers want shorter. What do you decide?",
        "choices": [
          {
            "id": "c1",
            "title": "Survey both sides and propose a compromise",
            "description": "Data-driven middle ground with feedback.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "trust": 8,
                "knowledge": 5
              },
              "relationships": {
                "teachers": 6,
                "students": 6
              },
              "hidden": {
                "leadership": 10,
                "ethics": 8,
                "planning": 6
              }
            },
            "next": "n2"
          },
          {
            "id": "c2",
            "title": "Side with teachers for discipline",
            "description": "Order first, comfort later.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "trust": -3
              },
              "relationships": {
                "teachers": 10,
                "students": -8
              },
              "hidden": {
                "leadership": 4,
                "ethics": -2
              }
            },
            "next": "n2"
          },
          {
            "id": "c3",
            "title": "Side with students for happiness",
            "description": "Comfort first, but lose teacher respect.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "trust": -2
              },
              "relationships": {
                "teachers": -8,
                "students": 10
              },
              "hidden": {
                "leadership": -2,
                "ethics": 2
              }
            },
            "next": "n2"
          }
        ]
      },
      {
        "id": "n2",
        "type": "decision",
        "text": "Day 2: A teacher reports broken lab equipment. Replacement costs 2000. Budget is tight.",
        "choices": [
          {
            "id": "c1",
            "title": "Repair what is possible, replace critical only",
            "description": "Smart prioritization.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "money": -1200,
                "knowledge": 4
              },
              "relationships": {
                "teachers": 6
              },
              "hidden": {
                "resource_optimization": 10,
                "planning": 8
              }
            },
            "next": "n3"
          },
          {
            "id": "c2",
            "title": "Buy new equipment immediately",
            "description": "Full replacement, but budget strain.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "money": -2000,
                "trust": 3
              },
              "relationships": {
                "teachers": 8
              },
              "hidden": {
                "resource_optimization": -4,
                "leadership": 4
              }
            },
            "next": "n3"
          },
          {
            "id": "c3",
            "title": "Delay and use theory classes instead",
            "description": "Save money, lose practical learning.",
            "risk": "medium",
            "reward": "low",
            "effects": {
              "resources": {
                "money": -200,
                "knowledge": -4
              },
              "relationships": {
                "teachers": -4,
                "students": -4
              },
              "hidden": {
                "planning": -4,
                "ethics": -3
              }
            },
            "next": "n3"
          }
        ]
      },
      {
        "id": "n3",
        "type": "decision",
        "text": "Day 3: A student is caught bullying. Parents demand no punishment. Victim is scared.",
        "choices": [
          {
            "id": "c1",
            "title": "Counseling for both, clear school policy",
            "description": "Restorative justice with structure.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "trust": 10,
                "time": -2
              },
              "relationships": {
                "parents": 4,
                "students": 6
              },
              "hidden": {
                "ethics": 12,
                "leadership": 8,
                "patience": 6
              }
            },
            "next": "n4"
          },
          {
            "id": "c2",
            "title": "Suspend the bully immediately",
            "description": "Punishment, but no deeper healing.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "trust": 2
              },
              "relationships": {
                "parents": -6
              },
              "hidden": {
                "ethics": 2,
                "leadership": 4
              }
            },
            "next": "n4"
          },
          {
            "id": "c3",
            "title": "Ignore and let them sort it out",
            "description": "Avoid conflict, but enable future harm.",
            "risk": "high",
            "reward": "low",
            "effects": {
              "resources": {
                "trust": -10
              },
              "relationships": {
                "students": -8
              },
              "hidden": {
                "ethics": -15,
                "leadership": -10
              }
            },
            "next": "n4"
          }
        ]
      },
      {
        "id": "n4",
        "type": "random",
        "text": "Day 4: A water pipe bursts. School may close tomorrow.",
        "effects": {
          "resources": {
            "money": -800,
            "time": -1
          }
        },
        "next": "n5"
      },
      {
        "id": "n5",
        "type": "decision",
        "text": "Day 4 continued: How do you handle the crisis?",
        "choices": [
          {
            "id": "c1",
            "title": "Coordinate staff, shift classes, arrange water",
            "description": "System response, keep school running.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "money": -300,
                "energy": -6,
                "trust": 8
              },
              "relationships": {
                "staff": 10,
                "teachers": 6
              },
              "hidden": {
                "adaptability": 12,
                "leadership": 10,
                "resource_optimization": 8
              }
            },
            "next": "n6"
          },
          {
            "id": "c2",
            "title": "Declare holiday and fix properly",
            "description": "Pause everything, solve fully.",
            "risk": "low",
            "reward": "medium",
            "effects": {
              "resources": {
                "knowledge": -3,
                "time": -1
              },
              "relationships": {
                "parents": 4
              },
              "hidden": {
                "planning": 6,
                "risk_management": 6
              }
            },
            "next": "n6"
          },
          {
            "id": "c3",
            "title": "Ask students to bring water bottles",
            "description": "Patch solution, avoid real cost.",
            "risk": "high",
            "reward": "low",
            "effects": {
              "resources": {
                "trust": -6
              },
              "relationships": {
                "students": -6
              },
              "hidden": {
                "resource_optimization": -8,
                "leadership": -6
              }
            },
            "next": "n6"
          }
        ]
      },
      {
        "id": "n6",
        "type": "decision",
        "text": "Day 5: Final review. A parent offers a donation for preferential treatment of their child.",
        "choices": [
          {
            "id": "c1",
            "title": "Decline politely, explain fairness",
            "description": "Ethical boundary, long-term trust.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "trust": 12,
                "confidence": 6
              },
              "relationships": {
                "parents": -4
              },
              "hidden": {
                "ethics": 15,
                "leadership": 8,
                "risk_management": 6
              }
            },
            "next": "ending"
          },
          {
            "id": "c2",
            "title": "Accept but treat everyone equally",
            "description": "Take money, hope no one notices.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "money": 2000,
                "trust": -8
              },
              "relationships": {
                "parents": 6
              },
              "hidden": {
                "ethics": -10,
                "risk_management": -8
              }
            },
            "next": "ending"
          },
          {
            "id": "c3",
            "title": "Accept and give their child privileges",
            "description": "Corruption for short-term gain.",
            "risk": "high",
            "reward": "low",
            "effects": {
              "resources": {
                "money": 2000,
                "trust": -15
              },
              "relationships": {
                "students": -10,
                "teachers": -8
              },
              "hidden": {
                "ethics": -20,
                "leadership": -15
              }
            },
            "next": "ending"
          }
        ]
      },
      {
        "id": "ending",
        "type": "ending",
        "text": "Your week ends. The school still stands. Some decisions echo longer than others.",
        "reflection": [
          "Which decision was hardest because it had no perfect answer?",
          "What is the relationship between fairness and leadership?"
        ]
      }
    ]
  },
  {
    "id": "ls-03-002",
    "meta": {
      "title": "Village Management",
      "level": 3,
      "theme": "master",
      "duration": "25 min",
      "difficulty": 3,
      "tags": [
        "agriculture",
        "water",
        "community",
        "systems",
        "long-term"
      ]
    },
    "intro": "You are the youth coordinator for a small village. Water, crops, school, and health all need attention.",
    "objective": "Improve the village over a full season without breaking any single system.",
    "resources": {
      "money": 8000,
      "time": 90,
      "energy": 85,
      "trust": 60,
      "knowledge": 75,
      "confidence": 60,
      "health": 90
    },
    "relationships": {
      "parents": 70,
      "friends": 60,
      "teachers": 55,
      "neighbors": 50,
      "elders": 55
    },
    "nodes": [
      {
        "id": "n1",
        "type": "decision",
        "text": "Season 1: Water is scarce. How do you manage it?",
        "choices": [
          {
            "id": "c1",
            "title": "Build a rainwater harvesting system",
            "description": "Long-term investment, community effort.",
            "risk": "medium",
            "reward": "high",
            "effects": {
              "resources": {
                "money": -3000,
                "time": -20,
                "knowledge": 8
              },
              "relationships": {
                "neighbors": 8,
                "elders": 10
              },
              "hidden": {
                "planning": 12,
                "resource_optimization": 10,
                "prediction": 10
              }
            },
            "next": "n2"
          },
          {
            "id": "c2",
            "title": "Dig deeper wells immediately",
            "description": "Quick water, but unsustainable.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "money": -2000,
                "time": -10
              },
              "relationships": {
                "elders": 4
              },
              "hidden": {
                "resource_optimization": -4,
                "prediction": -4
              }
            },
            "next": "n2"
          },
          {
            "id": "c3",
            "title": "Ration water strictly by household",
            "description": "Immediate control, but creates conflict.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "trust": -6,
                "time": -5
              },
              "relationships": {
                "neighbors": -6
              },
              "hidden": {
                "leadership": 4,
                "ethics": 2
              }
            },
            "next": "n2"
          }
        ]
      },
      {
        "id": "n2",
        "type": "decision",
        "text": "Season 2: Crops are failing. Pests are spreading. What is your priority?",
        "choices": [
          {
            "id": "c1",
            "title": "Introduce mixed cropping and organic pest control",
            "description": "Sustainable agriculture training.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "money": -1500,
                "time": -15,
                "knowledge": 10
              },
              "relationships": {
                "neighbors": 6
              },
              "hidden": {
                "planning": 10,
                "creativity": 8,
                "resource_optimization": 8
              }
            },
            "next": "n3"
          },
          {
            "id": "c2",
            "title": "Buy chemical pesticides and fertilizers",
            "description": "Fast yield, soil damage later.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "money": -1000,
                "time": -5
              },
              "hidden": {
                "resource_optimization": 2,
                "ethics": -4,
                "prediction": -6
              }
            },
            "next": "n3"
          },
          {
            "id": "c3",
            "title": "Focus on one crop and maximize it",
            "description": "Specialization, but risk if it fails.",
            "risk": "high",
            "reward": "low",
            "effects": {
              "resources": {
                "money": -500
              },
              "hidden": {
                "risk_management": -6,
                "planning": -3
              }
            },
            "next": "n3"
          }
        ]
      },
      {
        "id": "n3",
        "type": "decision",
        "text": "Season 3: The school needs a teacher. The clinic needs a nurse. You have funds for one.",
        "choices": [
          {
            "id": "c1",
            "title": "Fund the teacher, train a local health volunteer",
            "description": "Education official, health unofficial.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "money": -2500,
                "knowledge": 8
              },
              "relationships": {
                "teachers": 8,
                "elders": 6
              },
              "hidden": {
                "resource_optimization": 10,
                "leadership": 8,
                "ethics": 6
              }
            },
            "next": "n4"
          },
          {
            "id": "c2",
            "title": "Fund the nurse, use older students to teach younger",
            "description": "Health official, education peer-based.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "money": -2500,
                "health": 8
              },
              "relationships": {
                "elders": 6
              },
              "hidden": {
                "creativity": 8,
                "leadership": 6,
                "resource_optimization": 6
              }
            },
            "next": "n4"
          },
          {
            "id": "c3",
            "title": "Split the money and hire both part-time",
            "description": "Both get attention, but neither is full.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "money": -2500,
                "knowledge": 3,
                "health": 3
              },
              "hidden": {
                "resource_optimization": -4,
                "planning": -2
              }
            },
            "next": "n4"
          }
        ]
      },
      {
        "id": "n4",
        "type": "random",
        "text": "Unexpected drought: The harvest is 40% below expectation.",
        "effects": {
          "resources": {
            "money": -1000,
            "trust": -5
          },
          "relationships": {
            "neighbors": -3
          }
        },
        "next": "n5"
      },
      {
        "id": "n5",
        "type": "decision",
        "text": "Drought impact: Food shortage is real. What do you do?",
        "choices": [
          {
            "id": "c1",
            "title": "Request government aid and organize community kitchens",
            "description": "Systematic relief, community solidarity.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "money": 500,
                "trust": 8,
                "time": -10
              },
              "relationships": {
                "neighbors": 10,
                "elders": 8
              },
              "hidden": {
                "leadership": 12,
                "adaptability": 10,
                "ethics": 8
              }
            },
            "next": "n6"
          },
          {
            "id": "c2",
            "title": "Buy food from neighboring village",
            "description": "Market solution, but expensive.",
            "risk": "low",
            "reward": "medium",
            "effects": {
              "resources": {
                "money": -2000,
                "time": -5
              },
              "hidden": {
                "adaptability": 6,
                "resource_optimization": 4
              }
            },
            "next": "n6"
          },
          {
            "id": "c3",
            "title": "Let families handle their own shortage",
            "description": "Individual survival, community weakens.",
            "risk": "high",
            "reward": "low",
            "effects": {
              "resources": {
                "trust": -10
              },
              "relationships": {
                "neighbors": -8
              },
              "hidden": {
                "leadership": -10,
                "ethics": -8
              }
            },
            "next": "n6"
          }
        ]
      },
      {
        "id": "n6",
        "type": "decision",
        "text": "Season 4: You have one remaining project. What do you invest in for the future?",
        "choices": [
          {
            "id": "c1",
            "title": "Solar-powered irrigation",
            "description": "Energy and water independence.",
            "risk": "medium",
            "reward": "high",
            "effects": {
              "resources": {
                "money": -2000,
                "knowledge": 10
              },
              "relationships": {
                "elders": 8
              },
              "hidden": {
                "prediction": 12,
                "planning": 10,
                "creativity": 8
              }
            },
            "next": "ending"
          },
          {
            "id": "c2",
            "title": "Village library and internet",
            "description": "Education and connectivity.",
            "risk": "medium",
            "reward": "high",
            "effects": {
              "resources": {
                "money": -1500,
                "knowledge": 12
              },
              "relationships": {
                "teachers": 10
              },
              "hidden": {
                "creativity": 10,
                "leadership": 6
              }
            },
            "next": "ending"
          },
          {
            "id": "c3",
            "title": "Save the money for emergencies",
            "description": "Safety buffer, but no new growth.",
            "risk": "low",
            "reward": "medium",
            "effects": {
              "resources": {
                "money": 1000,
                "trust": 4
              },
              "hidden": {
                "risk_management": 8,
                "prediction": 6,
                "planning": 4
              }
            },
            "next": "ending"
          }
        ]
      },
      {
        "id": "ending",
        "type": "ending",
        "text": "One year passes. The village is different. Some systems are stronger. Some are still fragile. That is management.",
        "reflection": [
          "Which system was most connected to all others?",
          "Why is saving sometimes more strategic than spending?"
        ]
      }
    ]
  },
  {
    "id": "ls-03-003",
    "meta": {
      "title": "Island Survival",
      "level": 3,
      "theme": "master",
      "duration": "25 min",
      "difficulty": 3,
      "tags": [
        "survival",
        "resource",
        "priority",
        "risk",
        "systems"
      ]
    },
    "intro": "You and a small team are stranded on an island. Resources are limited. Weather is unpredictable.",
    "objective": "Survive, signal for rescue, and maintain team health and morale.",
    "resources": {
      "money": 0,
      "time": 30,
      "energy": 80,
      "trust": 60,
      "knowledge": 70,
      "confidence": 55,
      "health": 85
    },
    "relationships": {
      "friends": 65,
      "team": 60,
      "strangers": 50
    },
    "nodes": [
      {
        "id": "n1",
        "type": "decision",
        "text": "Hour 1: You find a small amount of fresh water, some food, and basic tools. What do you prioritize?",
        "choices": [
          {
            "id": "c1",
            "title": "Water first, then shelter, then food",
            "description": "Survival rule of three: 3 days without water.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "energy": -4,
                "health": 4,
                "knowledge": 4
              },
              "hidden": {
                "planning": 12,
                "resource_optimization": 10,
                "prediction": 8
              }
            },
            "next": "n2"
          },
          {
            "id": "c2",
            "title": "Build a large signal fire first",
            "description": "Rescue priority, but neglect immediate needs.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "energy": -10,
                "health": -2
              },
              "hidden": {
                "risk_management": 4,
                "planning": -4
              }
            },
            "next": "n2"
          },
          {
            "id": "c3",
            "title": "Search the island for more resources",
            "description": "Explore before settling, but risk energy loss.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "energy": -12,
                "time": -3
              },
              "hidden": {
                "creativity": 6,
                "adaptability": 6,
                "risk_management": -2
              }
            },
            "next": "n2"
          }
        ]
      },
      {
        "id": "n2",
        "type": "decision",
        "text": "Day 2: A team member is injured. Another is panicking. You can only address one well.",
        "choices": [
          {
            "id": "c1",
            "title": "Tend the injury first, calm the panicker with tasks",
            "description": "Medical priority, give the anxious person a job.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "health": 6,
                "energy": -6,
                "trust": 6
              },
              "relationships": {
                "team": 8
              },
              "hidden": {
                "leadership": 10,
                "adaptability": 8,
                "ethics": 8
              }
            },
            "next": "n3"
          },
          {
            "id": "c2",
            "title": "Calm the panicker first, bandage the injury quickly",
            "description": "Mental health priority, but wound may worsen.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "trust": 4,
                "health": -2
              },
              "relationships": {
                "team": 6
              },
              "hidden": {
                "leadership": 6,
                "patience": 6
              }
            },
            "next": "n3"
          },
          {
            "id": "c3",
            "title": "Tell them both to handle it themselves",
            "description": "Save your energy for the group.",
            "risk": "high",
            "reward": "low",
            "effects": {
              "resources": {
                "trust": -8,
                "health": -4
              },
              "relationships": {
                "team": -10
              },
              "hidden": {
                "ethics": -10,
                "leadership": -10
              }
            },
            "next": "n3"
          }
        ]
      },
      {
        "id": "n3",
        "type": "decision",
        "text": "Day 5: Food is running low. You see fish, unknown berries, and birds. What do you eat?",
        "choices": [
          {
            "id": "c1",
            "title": "Fish only, berries tested in small amounts",
            "description": "Known food sources, cautious approach.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "health": 4,
                "energy": 4
              },
              "hidden": {
                "risk_management": 10,
                "prediction": 8,
                "resource_optimization": 6
              }
            },
            "next": "n4"
          },
          {
            "id": "c2",
            "title": "Eat the berries, they look familiar",
            "description": "Risk unknown food to save energy.",
            "risk": "high",
            "reward": "medium",
            "effects": {
              "resources": {
                "health": -8,
                "energy": -4
              },
              "hidden": {
                "risk_management": -10,
                "prediction": -6
              }
            },
            "next": "n4"
          },
          {
            "id": "c3",
            "title": "Eat everything available",
            "description": "Maximize intake, ignore danger.",
            "risk": "high",
            "reward": "low",
            "effects": {
              "resources": {
                "health": -12,
                "energy": -6
              },
              "hidden": {
                "risk_management": -15,
                "planning": -6
              }
            },
            "next": "n4"
          }
        ]
      },
      {
        "id": "n4",
        "type": "random",
        "text": "Day 7: A storm destroys your shelter and half your food supply.",
        "effects": {
          "resources": {
            "energy": -8,
            "health": -4,
            "time": -3
          }
        },
        "next": "n5"
      },
      {
        "id": "n5",
        "type": "decision",
        "text": "After the storm: Low on food, no shelter, team morale is breaking. What now?",
        "choices": [
          {
            "id": "c1",
            "title": "Rebuild shelter together, ration food strictly, maintain hope",
            "description": "System recovery with discipline.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "energy": -6,
                "trust": 8,
                "health": 2
              },
              "relationships": {
                "team": 10
              },
              "hidden": {
                "adaptability": 12,
                "leadership": 12,
                "resource_optimization": 10
              }
            },
            "next": "n6"
          },
          {
            "id": "c2",
            "title": "Send the strongest to search for rescue while others rest",
            "description": "Divide labor, risk the few.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "energy": -4,
                "time": -2
              },
              "relationships": {
                "team": 4
              },
              "hidden": {
                "risk_management": 4,
                "leadership": 4
              }
            },
            "next": "n6"
          },
          {
            "id": "c3",
            "title": "Give up and wait for rescue",
            "description": "Passive survival, morale collapses.",
            "risk": "high",
            "reward": "low",
            "effects": {
              "resources": {
                "trust": -10,
                "health": -4
              },
              "relationships": {
                "team": -8
              },
              "hidden": {
                "adaptability": -8,
                "leadership": -10
              }
            },
            "next": "n6"
          }
        ]
      },
      {
        "id": "n6",
        "type": "decision",
        "text": "Day 10: A ship is visible on the horizon. You have one signal. What do you use?",
        "choices": [
          {
            "id": "c1",
            "title": "Large smoke signal during the day",
            "description": "Most visible, reliable signal.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "confidence": 8,
                "trust": 8
              },
              "hidden": {
                "prediction": 8,
                "planning": 6,
                "resource_optimization": 6
              }
            },
            "next": "ending"
          },
          {
            "id": "c2",
            "title": "Fire signal at night",
            "description": "Visible at night, but wait is risky.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "energy": -4,
                "confidence": 4
              },
              "hidden": {
                "patience": 6,
                "risk_management": 4
              }
            },
            "next": "ending"
          },
          {
            "id": "c3",
            "title": "Send the fastest swimmer",
            "description": "Direct contact, but dangerous.",
            "risk": "high",
            "reward": "low",
            "effects": {
              "resources": {
                "health": -6,
                "energy": -6
              },
              "hidden": {
                "risk_management": -6,
                "prediction": -4
              }
            },
            "next": "ending"
          }
        ]
      },
      {
        "id": "ending",
        "type": "ending",
        "text": "Rescue comes, or survival continues. Either way, you understand what keeps people alive.",
        "reflection": [
          "What was more important than any single resource?",
          "How did team trust affect survival?"
        ]
      }
    ]
  },
  {
    "id": "ls-03-004",
    "meta": {
      "title": "Business Startup",
      "level": 3,
      "theme": "master",
      "duration": "20 min",
      "difficulty": 3,
      "tags": [
        "business",
        "market",
        "investment",
        "ethics",
        "systems"
      ]
    },
    "intro": "You have a small startup idea and a limited investment. Market, competition, and cash flow are real.",
    "objective": "Build a sustainable small business without compromising values.",
    "resources": {
      "money": 10000,
      "time": 60,
      "energy": 85,
      "trust": 65,
      "knowledge": 78,
      "confidence": 62,
      "health": 95
    },
    "relationships": {
      "parents": 68,
      "friends": 60,
      "neighbors": 55,
      "team": 50
    },
    "nodes": [
      {
        "id": "n1",
        "type": "decision",
        "text": "Phase 1: You have 10,000. What is your first investment?",
        "choices": [
          {
            "id": "c1",
            "title": "Product quality and small test market",
            "description": "Build strong base, validate demand.",
            "risk": "medium",
            "reward": "high",
            "effects": {
              "resources": {
                "money": -4000,
                "knowledge": 8,
                "trust": 4
              },
              "hidden": {
                "planning": 10,
                "prediction": 10,
                "resource_optimization": 8
              }
            },
            "next": "n2"
          },
          {
            "id": "c2",
            "title": "Big marketing campaign first",
            "description": "Create buzz before product is perfect.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "money": -6000,
                "trust": 2
              },
              "hidden": {
                "creativity": 8,
                "risk_management": -4,
                "planning": -4
              }
            },
            "next": "n2"
          },
          {
            "id": "c3",
            "title": "Hire employees immediately",
            "description": "Team first, but burn cash fast.",
            "risk": "high",
            "reward": "low",
            "effects": {
              "resources": {
                "money": -7000,
                "time": -5
              },
              "relationships": {
                "team": 6
              },
              "hidden": {
                "resource_optimization": -8,
                "planning": -6
              }
            },
            "next": "n2"
          }
        ]
      },
      {
        "id": "n2",
        "type": "decision",
        "text": "Phase 2: A competitor copies your idea and prices lower. What do you do?",
        "choices": [
          {
            "id": "c1",
            "title": "Improve quality and customer service",
            "description": "Differentiate, do not compete on price.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "money": -1500,
                "knowledge": 6
              },
              "hidden": {
                "creativity": 8,
                "leadership": 6,
                "ethics": 6
              }
            },
            "next": "n3"
          },
          {
            "id": "c2",
            "title": "Lower your price to match",
            "description": "Price war, thinner margins.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "money": -500,
                "trust": -2
              },
              "hidden": {
                "resource_optimization": -4,
                "risk_management": -3
              }
            },
            "next": "n3"
          },
          {
            "id": "c3",
            "title": "Copy their features and add more",
            "description": "Reactive competition, lose identity.",
            "risk": "medium",
            "reward": "low",
            "effects": {
              "resources": {
                "money": -2000,
                "knowledge": 2
              },
              "hidden": {
                "creativity": -4,
                "ethics": -4
              }
            },
            "next": "n3"
          }
        ]
      },
      {
        "id": "n3",
        "type": "decision",
        "text": "Phase 3: A supplier offers cheaper materials if you hide quality issues from customers.",
        "choices": [
          {
            "id": "c1",
            "title": "Reject the offer, find ethical suppliers",
            "description": "Values over short-term profit.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "money": -800,
                "trust": 10
              },
              "hidden": {
                "ethics": 15,
                "leadership": 8,
                "risk_management": 6
              }
            },
            "next": "n4"
          },
          {
            "id": "c2",
            "title": "Accept but improve quality later",
            "description": "Temporary compromise, future fix.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "money": 500,
                "trust": -6
              },
              "hidden": {
                "ethics": -8,
                "prediction": -4
              }
            },
            "next": "n4"
          },
          {
            "id": "c3",
            "title": "Accept and keep silent",
            "description": "Profit at customer expense.",
            "risk": "high",
            "reward": "low",
            "effects": {
              "resources": {
                "money": 1500,
                "trust": -15
              },
              "hidden": {
                "ethics": -20,
                "leadership": -10,
                "risk_management": -8
              }
            },
            "next": "n4"
          }
        ]
      },
      {
        "id": "n4",
        "type": "random",
        "text": "Phase 4: A major customer delays payment. Cash flow is critical.",
        "effects": {
          "resources": {
            "money": -2000,
            "time": -3
          }
        },
        "next": "n5"
      },
      {
        "id": "n5",
        "type": "decision",
        "text": "Cash flow crisis: You cannot pay all bills. What do you prioritize?",
        "choices": [
          {
            "id": "c1",
            "title": "Pay employees first, negotiate with suppliers",
            "description": "People first, trust with partners.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "money": -1500,
                "trust": 8
              },
              "relationships": {
                "team": 10
              },
              "hidden": {
                "leadership": 12,
                "ethics": 10,
                "resource_optimization": 8
              }
            },
            "next": "n6"
          },
          {
            "id": "c2",
            "title": "Pay suppliers first, delay employee salaries",
            "description": "Keep supply chain, risk team morale.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "money": -1000
              },
              "relationships": {
                "team": -8
              },
              "hidden": {
                "leadership": -4,
                "ethics": -4
              }
            },
            "next": "n6"
          },
          {
            "id": "c3",
            "title": "Borrow from a high-interest lender",
            "description": "Quick cash, dangerous future.",
            "risk": "high",
            "reward": "low",
            "effects": {
              "resources": {
                "money": 1000,
                "trust": -4
              },
              "hidden": {
                "risk_management": -10,
                "planning": -6
              }
            },
            "next": "n6"
          }
        ]
      },
      {
        "id": "n6",
        "type": "decision",
        "text": "Phase 5: The business is stable. Where do you invest profits?",
        "choices": [
          {
            "id": "c1",
            "title": "Research and development for better product",
            "description": "Innovation, future growth.",
            "risk": "medium",
            "reward": "high",
            "effects": {
              "resources": {
                "money": -2000,
                "knowledge": 10
              },
              "hidden": {
                "creativity": 10,
                "prediction": 10,
                "planning": 8
              }
            },
            "next": "ending"
          },
          {
            "id": "c2",
            "title": "Expand to new markets",
            "description": "Growth, but stretched resources.",
            "risk": "medium",
            "reward": "high",
            "effects": {
              "resources": {
                "money": -3000,
                "time": -10
              },
              "hidden": {
                "creativity": 8,
                "risk_management": 6
              }
            },
            "next": "ending"
          },
          {
            "id": "c3",
            "title": "Take profits and keep the business small",
            "description": "Stability, but no growth.",
            "risk": "low",
            "reward": "medium",
            "effects": {
              "resources": {
                "money": 2000,
                "trust": 4
              },
              "hidden": {
                "risk_management": 8,
                "patience": 6
              }
            },
            "next": "ending"
          }
        ]
      },
      {
        "id": "ending",
        "type": "ending",
        "text": "The business lives. The choices made were not just about money. They were about what kind of business you built.",
        "reflection": [
          "What was more valuable than profit?",
          "How did early ethics decisions shape the ending?"
        ]
      }
    ]
  },
  {
    "id": "ls-03-005",
    "meta": {
      "title": "Hospital Management",
      "level": 3,
      "theme": "master",
      "duration": "25 min",
      "difficulty": 3,
      "tags": [
        "healthcare",
        "triage",
        "ethics",
        "systems",
        "crisis"
      ]
    },
    "intro": "You are managing a small rural clinic for a day. Patients, supplies, staff, and emergencies all arrive.",
    "objective": "Save lives, maintain staff health, and manage resources ethically.",
    "resources": {
      "money": 3000,
      "time": 12,
      "energy": 80,
      "trust": 70,
      "knowledge": 82,
      "confidence": 60,
      "health": 95
    },
    "relationships": {
      "parents": 55,
      "friends": 50,
      "staff": 60,
      "patients": 50,
      "neighbors": 55
    },
    "nodes": [
      {
        "id": "n1",
        "type": "decision",
        "text": "Morning: Three patients arrive. One critical, two stable. You have one nurse. What do you do?",
        "choices": [
          {
            "id": "c1",
            "title": "Treat critical first, assign nurse to stable patients for monitoring",
            "description": "Triage with attention to all.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "time": -2,
                "energy": -4,
                "trust": 6
              },
              "relationships": {
                "patients": 8,
                "staff": 6
              },
              "hidden": {
                "leadership": 10,
                "ethics": 10,
                "resource_optimization": 8
              }
            },
            "next": "n2"
          },
          {
            "id": "c2",
            "title": "Treat critical first, make stable patients wait",
            "description": "Correct triage, but wait may worsen.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "time": -1,
                "trust": 2
              },
              "relationships": {
                "patients": 2
              },
              "hidden": {
                "ethics": 4,
                "risk_management": 4
              }
            },
            "next": "n2"
          },
          {
            "id": "c3",
            "title": "Treat stable patients first because they are easier",
            "description": "Avoid hard cases, critical dies.",
            "risk": "high",
            "reward": "low",
            "effects": {
              "resources": {
                "trust": -10
              },
              "relationships": {
                "patients": -10,
                "staff": -4
              },
              "hidden": {
                "ethics": -20,
                "leadership": -15
              }
            },
            "next": "n2"
          }
        ]
      },
      {
        "id": "n2",
        "type": "decision",
        "text": "Midday: Medicine supply is low. You can order now (expensive) or wait for government supply (delayed).",
        "choices": [
          {
            "id": "c1",
            "title": "Order emergency stock, absorb cost",
            "description": "Patient safety over budget.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "money": -1500,
                "trust": 8
              },
              "relationships": {
                "staff": 6
              },
              "hidden": {
                "ethics": 10,
                "resource_optimization": 6,
                "leadership": 6
              }
            },
            "next": "n3"
          },
          {
            "id": "c2",
            "title": "Wait for government supply, ration current stock",
            "description": "Budget safe, but risk shortage.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "money": -300,
                "time": -2
              },
              "hidden": {
                "resource_optimization": 4,
                "risk_management": -3
              }
            },
            "next": "n3"
          },
          {
            "id": "c3",
            "title": "Buy cheap unverified medicine from local seller",
            "description": "Save money, but quality unknown.",
            "risk": "high",
            "reward": "low",
            "effects": {
              "resources": {
                "money": -500,
                "trust": -8
              },
              "relationships": {
                "patients": -6
              },
              "hidden": {
                "ethics": -15,
                "risk_management": -10
              }
            },
            "next": "n3"
          }
        ]
      },
      {
        "id": "n3",
        "type": "decision",
        "text": "Afternoon: A wealthy patient offers a large donation if treated first tomorrow. Others are waiting.",
        "choices": [
          {
            "id": "c1",
            "title": "Decline and maintain first-come-first-served",
            "description": "Equity over money.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "trust": 12,
                "confidence": 6
              },
              "relationships": {
                "patients": 8
              },
              "hidden": {
                "ethics": 15,
                "leadership": 10,
                "risk_management": 6
              }
            },
            "next": "n4"
          },
          {
            "id": "c2",
            "title": "Accept but treat them within normal queue",
            "description": "Take money, keep fairness.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "money": 2000,
                "trust": -4
              },
              "hidden": {
                "ethics": -2,
                "resource_optimization": 4
              }
            },
            "next": "n4"
          },
          {
            "id": "c3",
            "title": "Accept and give them priority",
            "description": "Wealth buys health.",
            "risk": "high",
            "reward": "low",
            "effects": {
              "resources": {
                "money": 2000,
                "trust": -15
              },
              "relationships": {
                "patients": -10
              },
              "hidden": {
                "ethics": -20,
                "leadership": -10
              }
            },
            "next": "n4"
          }
        ]
      },
      {
        "id": "n4",
        "type": "random",
        "text": "Evening: A car accident brings three injured people. Staff is exhausted.",
        "effects": {
          "resources": {
            "energy": -6,
            "time": -2
          },
          "relationships": {
            "staff": -3
          }
        },
        "next": "n5"
      },
      {
        "id": "n5",
        "type": "decision",
        "text": "Emergency: Staff is exhausted, but three lives are at risk. What do you do?",
        "choices": [
          {
            "id": "c1",
            "title": "Call all staff in, including off-duty, share the burden",
            "description": "Team mobilization, rotate rest.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "energy": -8,
                "trust": 10
              },
              "relationships": {
                "staff": 10,
                "patients": 10
              },
              "hidden": {
                "leadership": 15,
                "adaptability": 10,
                "ethics": 10
              }
            },
            "next": "n6"
          },
          {
            "id": "c2",
            "title": "Transfer stable cases to nearest hospital, focus on critical",
            "description": "Triage with referral.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "time": -1,
                "money": -500
              },
              "relationships": {
                "patients": 4
              },
              "hidden": {
                "resource_optimization": 6,
                "risk_management": 6
              }
            },
            "next": "n6"
          },
          {
            "id": "c3",
            "title": "Ask families to help care for their own",
            "description": "Reduce clinic load, but unprofessional.",
            "risk": "high",
            "reward": "low",
            "effects": {
              "resources": {
                "trust": -8
              },
              "relationships": {
                "patients": -6
              },
              "hidden": {
                "ethics": -10,
                "leadership": -8
              }
            },
            "next": "n6"
          }
        ]
      },
      {
        "id": "n6",
        "type": "decision",
        "text": "Night: The day is over. One final resource remains. What do you improve?",
        "choices": [
          {
            "id": "c1",
            "title": "Staff rest area and training",
            "description": "Invest in people who save lives.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "money": -800,
                "knowledge": 6
              },
              "relationships": {
                "staff": 10
              },
              "hidden": {
                "leadership": 10,
                "resource_optimization": 8,
                "planning": 6
              }
            },
            "next": "ending"
          },
          {
            "id": "c2",
            "title": "Better equipment for faster diagnosis",
            "description": "Technology investment.",
            "risk": "medium",
            "reward": "high",
            "effects": {
              "resources": {
                "money": -1200,
                "knowledge": 8
              },
              "hidden": {
                "creativity": 6,
                "planning": 6
              }
            },
            "next": "ending"
          },
          {
            "id": "c3",
            "title": "Save the money for future emergencies",
            "description": "Buffer fund.",
            "risk": "low",
            "reward": "medium",
            "effects": {
              "resources": {
                "money": 500,
                "trust": 4
              },
              "hidden": {
                "risk_management": 8,
                "prediction": 6
              }
            },
            "next": "ending"
          }
        ]
      },
      {
        "id": "ending",
        "type": "ending",
        "text": "The clinic sleeps. Some patients recover. Some scars remain. You managed a system where every choice is a life.",
        "reflection": [
          "What was the heaviest decision?",
          "How does resource scarcity test ethics?"
        ]
      }
    ]
  },
  {
    "id": "ls-03-006",
    "meta": {
      "title": "Family Economy",
      "level": 3,
      "theme": "master",
      "duration": "20 min",
      "difficulty": 3,
      "tags": [
        "finance",
        "family",
        "planning",
        "tradeoff",
        "ethics"
      ]
    },
    "intro": "You are helping manage your family finances for a year. Income is limited. Needs are many.",
    "objective": "Balance savings, education, health, and emergencies over 12 months.",
    "resources": {
      "money": 50000,
      "time": 12,
      "energy": 80,
      "trust": 75,
      "knowledge": 72,
      "confidence": 65,
      "health": 92
    },
    "relationships": {
      "parents": 80,
      "friends": 55,
      "neighbors": 50,
      "siblings": 70
    },
    "nodes": [
      {
        "id": "n1",
        "type": "decision",
        "text": "Month 1: Annual budget. What gets the largest share?",
        "choices": [
          {
            "id": "c1",
            "title": "Education and health first, then savings, then wants",
            "description": "Future-first budgeting.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "money": -5000,
                "knowledge": 6,
                "health": 4
              },
              "relationships": {
                "parents": 8,
                "siblings": 6
              },
              "hidden": {
                "planning": 12,
                "resource_optimization": 10,
                "ethics": 6
              }
            },
            "next": "n2"
          },
          {
            "id": "c2",
            "title": "Equal share for everything",
            "description": "Fair distribution, but no priority.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "money": -3000,
                "trust": 2
              },
              "hidden": {
                "planning": 2,
                "resource_optimization": -2
              }
            },
            "next": "n2"
          },
          {
            "id": "c3",
            "title": "Spend on immediate comfort and hope for more income",
            "description": "Short-term happiness, no buffer.",
            "risk": "high",
            "reward": "low",
            "effects": {
              "resources": {
                "money": -8000,
                "trust": -4
              },
              "hidden": {
                "planning": -8,
                "risk_management": -6,
                "patience": -6
              }
            },
            "next": "n2"
          }
        ]
      },
      {
        "id": "n2",
        "type": "decision",
        "text": "Month 3: A sibling needs a course for career growth. It costs 15,000. Budget is tight.",
        "choices": [
          {
            "id": "c1",
            "title": "Support the course, reduce discretionary spending",
            "description": "Invest in family potential.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "money": -15000,
                "knowledge": 8,
                "trust": 6
              },
              "relationships": {
                "siblings": 12,
                "parents": 6
              },
              "hidden": {
                "ethics": 10,
                "leadership": 6,
                "planning": 6
              }
            },
            "next": "n3"
          },
          {
            "id": "c2",
            "title": "Suggest a loan they repay later",
            "description": "Help with responsibility.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "money": -5000,
                "trust": 2
              },
              "relationships": {
                "siblings": 4
              },
              "hidden": {
                "resource_optimization": 4,
                "ethics": 4
              }
            },
            "next": "n3"
          },
          {
            "id": "c3",
            "title": "Say no, family needs come first",
            "description": "Conservative, but sibling loses opportunity.",
            "risk": "medium",
            "reward": "low",
            "effects": {
              "resources": {
                "money": 0,
                "trust": -2
              },
              "relationships": {
                "siblings": -8
              },
              "hidden": {
                "ethics": -4,
                "leadership": -2
              }
            },
            "next": "n3"
          }
        ]
      },
      {
        "id": "n3",
        "type": "decision",
        "text": "Month 6: A health emergency needs 20,000. You have savings, but it empties the buffer.",
        "choices": [
          {
            "id": "c1",
            "title": "Use savings, then rebuild buffer with small monthly cuts",
            "description": "Health is wealth, plan recovery.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "money": -20000,
                "health": 10,
                "trust": 8
              },
              "relationships": {
                "parents": 10
              },
              "hidden": {
                "planning": 10,
                "ethics": 10,
                "adaptability": 6
              }
            },
            "next": "n4"
          },
          {
            "id": "c2",
            "title": "Borrow from relatives",
            "description": "Keep savings, but create debt.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "money": -5000,
                "trust": -4
              },
              "relationships": {
                "parents": 2
              },
              "hidden": {
                "risk_management": -4,
                "resource_optimization": -2
              }
            },
            "next": "n4"
          },
          {
            "id": "c3",
            "title": "Delay treatment and hope it improves",
            "description": "Gamble with health.",
            "risk": "high",
            "reward": "low",
            "effects": {
              "resources": {
                "health": -8,
                "trust": -8
              },
              "relationships": {
                "parents": -6
              },
              "hidden": {
                "ethics": -15,
                "risk_management": -12
              }
            },
            "next": "n4"
          }
        ]
      },
      {
        "id": "n4",
        "type": "random",
        "text": "Month 9: Income drops by 30% due to unexpected job loss.",
        "effects": {
          "resources": {
            "money": -5000,
            "trust": -5
          }
        },
        "next": "n5"
      },
      {
        "id": "n5",
        "type": "decision",
        "text": "Income is lower. How do you adapt the budget?",
        "choices": [
          {
            "id": "c1",
            "title": "Cut wants completely, protect education and health",
            "description": "Core priorities survive.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "money": -2000,
                "trust": 6
              },
              "relationships": {
                "parents": 6
              },
              "hidden": {
                "resource_optimization": 12,
                "planning": 10,
                "adaptability": 8
              }
            },
            "next": "n6"
          },
          {
            "id": "c2",
            "title": "Everyone reduces equally including education",
            "description": "Shared pain, but future suffers.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "money": -1000,
                "knowledge": -3
              },
              "hidden": {
                "resource_optimization": 2,
                "planning": -2
              }
            },
            "next": "n6"
          },
          {
            "id": "c3",
            "title": "Use credit cards and worry later",
            "description": "Debt trap.",
            "risk": "high",
            "reward": "low",
            "effects": {
              "resources": {
                "money": 2000,
                "trust": -8
              },
              "hidden": {
                "risk_management": -15,
                "planning": -10,
                "ethics": -4
              }
            },
            "next": "n6"
          }
        ]
      },
      {
        "id": "n6",
        "type": "decision",
        "text": "Month 12: Year end. You have a small surplus. What do you do?",
        "choices": [
          {
            "id": "c1",
            "title": "Start an emergency fund for the family",
            "description": "Future protection.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "money": -3000,
                "trust": 8
              },
              "relationships": {
                "parents": 8
              },
              "hidden": {
                "planning": 12,
                "prediction": 10,
                "resource_optimization": 8
              }
            },
            "next": "ending"
          },
          {
            "id": "c2",
            "title": "Celebrate together and share joy",
            "description": "Morale and bonding.",
            "risk": "low",
            "reward": "medium",
            "effects": {
              "resources": {
                "money": -2000,
                "health": 4,
                "trust": 4
              },
              "relationships": {
                "siblings": 8
              },
              "hidden": {
                "ethics": 6,
                "patience": 4
              }
            },
            "next": "ending"
          },
          {
            "id": "c3",
            "title": "Invest in a small side income source",
            "description": "Growth, but risk.",
            "risk": "medium",
            "reward": "high",
            "effects": {
              "resources": {
                "money": -3000,
                "knowledge": 4
              },
              "hidden": {
                "creativity": 8,
                "risk_management": 6
              }
            },
            "next": "ending"
          }
        ]
      },
      {
        "id": "ending",
        "type": "ending",
        "text": "The year ends. The family is together. Money was managed, but love was the real budget.",
        "reflection": [
          "What was the most important financial decision?",
          "How do family tradeoffs differ from individual ones?"
        ]
      }
    ]
  },
  {
    "id": "ls-03-007",
    "meta": {
      "title": "Environmental Conservation",
      "level": 3,
      "theme": "master",
      "duration": "20 min",
      "difficulty": 3,
      "tags": [
        "environment",
        "community",
        "long-term",
        "systems",
        "ethics"
      ]
    },
    "intro": "You are leading a local environmental initiative. Pollution, waste, and community habits are the enemies.",
    "objective": "Create sustainable change without alienating the community.",
    "resources": {
      "money": 6000,
      "time": 60,
      "energy": 82,
      "trust": 60,
      "knowledge": 76,
      "confidence": 62,
      "health": 94
    },
    "relationships": {
      "parents": 65,
      "friends": 60,
      "neighbors": 55,
      "teachers": 58,
      "elders": 50
    },
    "nodes": [
      {
        "id": "n1",
        "type": "decision",
        "text": "Phase 1: The river is polluted. Where do you start?",
        "choices": [
          {
            "id": "c1",
            "title": "Community cleanup drives and awareness",
            "description": "People first, problem second.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "money": -800,
                "time": -10,
                "knowledge": 6
              },
              "relationships": {
                "neighbors": 8,
                "elders": 6
              },
              "hidden": {
                "leadership": 10,
                "ethics": 8,
                "planning": 6
              }
            },
            "next": "n2"
          },
          {
            "id": "c2",
            "title": "Report to government and wait for action",
            "description": "Official route, but slow.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "time": -5,
                "trust": 2
              },
              "relationships": {
                "elders": 2
              },
              "hidden": {
                "patience": 6,
                "leadership": -2
              }
            },
            "next": "n2"
          },
          {
            "id": "c3",
            "title": "Install filters on your own",
            "description": "Local fix, but not systemic.",
            "risk": "medium",
            "reward": "low",
            "effects": {
              "resources": {
                "money": -2000,
                "knowledge": 2
              },
              "hidden": {
                "resource_optimization": -4,
                "planning": -2
              }
            },
            "next": "n2"
          }
        ]
      },
      {
        "id": "n2",
        "type": "decision",
        "text": "Phase 2: A factory is the main polluter. They offer sponsorship for your project if you stay silent.",
        "choices": [
          {
            "id": "c1",
            "title": "Reject and publicly advocate for cleaner production",
            "description": "Truth over money.",
            "risk": "medium",
            "reward": "high",
            "effects": {
              "resources": {
                "money": -500,
                "trust": 10
              },
              "relationships": {
                "neighbors": 8
              },
              "hidden": {
                "ethics": 15,
                "leadership": 10,
                "creativity": 6
              }
            },
            "next": "n3"
          },
          {
            "id": "c2",
            "title": "Accept but use the money for green projects",
            "description": "Compromise, but conflicted.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "money": 2000,
                "trust": -6
              },
              "relationships": {
                "elders": 4
              },
              "hidden": {
                "ethics": -8,
                "resource_optimization": 4
              }
            },
            "next": "n3"
          },
          {
            "id": "c3",
            "title": "Accept and stay silent",
            "description": "Betrayal of the cause.",
            "risk": "high",
            "reward": "low",
            "effects": {
              "resources": {
                "money": 2000,
                "trust": -15
              },
              "relationships": {
                "neighbors": -10
              },
              "hidden": {
                "ethics": -20,
                "leadership": -15
              }
            },
            "next": "n3"
          }
        ]
      },
      {
        "id": "n3",
        "type": "decision",
        "text": "Phase 3: Waste segregation is failing. People mix everything. What do you change?",
        "choices": [
          {
            "id": "c1",
            "title": "Design simple color-coded bins and educate children",
            "description": "Education and infrastructure.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "money": -1200,
                "knowledge": 8,
                "time": -10
              },
              "relationships": {
                "neighbors": 6,
                "teachers": 8
              },
              "hidden": {
                "creativity": 10,
                "planning": 8,
                "leadership": 6
              }
            },
            "next": "n4"
          },
          {
            "id": "c2",
            "title": "Fine households who do not segregate",
            "description": "Punishment, but builds resentment.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "trust": -4,
                "money": 200
              },
              "relationships": {
                "neighbors": -6
              },
              "hidden": {
                "leadership": -4,
                "ethics": -2
              }
            },
            "next": "n4"
          },
          {
            "id": "c3",
            "title": "Do nothing, habits change slowly",
            "description": "Passive acceptance.",
            "risk": "high",
            "reward": "low",
            "effects": {
              "resources": {
                "trust": -2
              },
              "hidden": {
                "leadership": -6,
                "adaptability": -4
              }
            },
            "next": "n4"
          }
        ]
      },
      {
        "id": "n4",
        "type": "random",
        "text": "Phase 4: A flood damages your newly planted green belt.",
        "effects": {
          "resources": {
            "money": -800,
            "time": -5,
            "energy": -6
          }
        },
        "next": "n5"
      },
      {
        "id": "n5",
        "type": "decision",
        "text": "Flood damage: The green belt is destroyed. What is your response?",
        "choices": [
          {
            "id": "c1",
            "title": "Replant with flood-resistant species, involve community",
            "description": "Adapt and rebuild stronger.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "money": -1000,
                "time": -10,
                "knowledge": 6
              },
              "relationships": {
                "neighbors": 10
              },
              "hidden": {
                "adaptability": 12,
                "prediction": 10,
                "creativity": 8
              }
            },
            "next": "n6"
          },
          {
            "id": "c2",
            "title": "Rebuild exactly as before",
            "description": "Same design, same risk.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "money": -800,
                "time": -5
              },
              "hidden": {
                "planning": 2,
                "adaptability": -2
              }
            },
            "next": "n6"
          },
          {
            "id": "c3",
            "title": "Abandon the green belt project",
            "description": "Give up on the area.",
            "risk": "high",
            "reward": "low",
            "effects": {
              "resources": {
                "trust": -6
              },
              "relationships": {
                "neighbors": -6
              },
              "hidden": {
                "patience": -6,
                "leadership": -8
              }
            },
            "next": "n6"
          }
        ]
      },
      {
        "id": "n6",
        "type": "decision",
        "text": "Phase 5: One year later. What is your legacy project?",
        "choices": [
          {
            "id": "c1",
            "title": "Community-run compost and garden system",
            "description": "Self-sustaining, educational.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "money": -1000,
                "knowledge": 10
              },
              "relationships": {
                "neighbors": 10,
                "teachers": 8
              },
              "hidden": {
                "creativity": 12,
                "leadership": 10,
                "planning": 10
              }
            },
            "next": "ending"
          },
          {
            "id": "c2",
            "title": "Solar energy for the community center",
            "description": "Technology, but expensive.",
            "risk": "medium",
            "reward": "high",
            "effects": {
              "resources": {
                "money": -2500,
                "knowledge": 8
              },
              "relationships": {
                "elders": 8
              },
              "hidden": {
                "creativity": 10,
                "prediction": 8
              }
            },
            "next": "ending"
          },
          {
            "id": "c3",
            "title": "Annual awareness festival",
            "description": "Culture of green, but event-driven.",
            "risk": "low",
            "reward": "medium",
            "effects": {
              "resources": {
                "money": -500,
                "trust": 6
              },
              "relationships": {
                "friends": 8
              },
              "hidden": {
                "creativity": 6,
                "patience": 4
              }
            },
            "next": "ending"
          }
        ]
      },
      {
        "id": "ending",
        "type": "ending",
        "text": "The river is cleaner. The children know. The community remembers. Systems change slowly, but they change.",
        "reflection": [
          "What was the hardest habit to change?",
          "How does one person influence a system?"
        ]
      }
    ]
  },
  {
    "id": "ls-03-008",
    "meta": {
      "title": "Disaster Management",
      "level": 3,
      "theme": "master",
      "duration": "25 min",
      "difficulty": 3,
      "tags": [
        "crisis",
        "coordination",
        "safety",
        "systems",
        "leadership"
      ]
    },
    "intro": "A cyclone warning is issued. You have 24 hours to prepare your neighborhood.",
    "objective": "Save lives, protect property, and maintain order before and after the storm.",
    "resources": {
      "money": 4000,
      "time": 24,
      "energy": 85,
      "trust": 65,
      "knowledge": 74,
      "confidence": 60,
      "health": 95
    },
    "relationships": {
      "parents": 70,
      "friends": 65,
      "neighbors": 60,
      "elders": 55,
      "strangers": 50
    },
    "nodes": [
      {
        "id": "n1",
        "type": "decision",
        "text": "Hour 1: Warning received. What is your first action?",
        "choices": [
          {
            "id": "c1",
            "title": "Map vulnerable houses and assign volunteers",
            "description": "Systematic preparation, community coordination.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "time": -3,
                "energy": -4,
                "knowledge": 6
              },
              "relationships": {
                "neighbors": 8,
                "elders": 6
              },
              "hidden": {
                "leadership": 12,
                "planning": 12,
                "prediction": 10
              }
            },
            "next": "n2"
          },
          {
            "id": "c2",
            "title": "Warn everyone by loudspeaker and social media",
            "description": "Information blast, but no coordination.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "time": -1,
                "energy": -2
              },
              "relationships": {
                "neighbors": 4
              },
              "hidden": {
                "adaptability": 6,
                "leadership": 4
              }
            },
            "next": "n2"
          },
          {
            "id": "c3",
            "title": "Pack your own house first",
            "description": "Self-preservation, ignore others.",
            "risk": "high",
            "reward": "low",
            "effects": {
              "resources": {
                "trust": -8
              },
              "relationships": {
                "neighbors": -8
              },
              "hidden": {
                "ethics": -10,
                "leadership": -10
              }
            },
            "next": "n2"
          }
        ]
      },
      {
        "id": "n2",
        "type": "decision",
        "text": "Hour 6: Some families refuse to evacuate. Elders are stubborn. Children are scared.",
        "choices": [
          {
            "id": "c1",
            "title": "Send respected elders to convince them, offer support",
            "description": "Peer influence, gentle pressure.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "time": -2,
                "trust": 6
              },
              "relationships": {
                "elders": 8,
                "neighbors": 6
              },
              "hidden": {
                "leadership": 10,
                "ethics": 8,
                "patience": 8
              }
            },
            "next": "n3"
          },
          {
            "id": "c2",
            "title": "Force evacuation with community volunteers",
            "description": "Safety over choice, but conflict.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "energy": -6,
                "trust": -2
              },
              "relationships": {
                "neighbors": -4
              },
              "hidden": {
                "leadership": 6,
                "ethics": 2
              }
            },
            "next": "n3"
          },
          {
            "id": "c3",
            "title": "Leave them and focus on willing families",
            "description": "Efficiency, but abandon the vulnerable.",
            "risk": "high",
            "reward": "low",
            "effects": {
              "resources": {
                "trust": -10
              },
              "relationships": {
                "elders": -8
              },
              "hidden": {
                "ethics": -15,
                "leadership": -10
              }
            },
            "next": "n3"
          }
        ]
      },
      {
        "id": "n3",
        "type": "decision",
        "text": "Hour 12: Supplies are short. You have food, water, medicine, but not enough for everyone.",
        "choices": [
          {
            "id": "c1",
            "title": "Prioritize children, elderly, and pregnant women",
            "description": "Triage by vulnerability.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "trust": 10,
                "energy": -4
              },
              "relationships": {
                "neighbors": 10
              },
              "hidden": {
                "ethics": 15,
                "leadership": 10,
                "resource_optimization": 8
              }
            },
            "next": "n4"
          },
          {
            "id": "c2",
            "title": "Distribute equally to all households",
            "description": "Fair share, but vulnerable get less.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "trust": 2
              },
              "hidden": {
                "ethics": 4,
                "resource_optimization": -4
              }
            },
            "next": "n4"
          },
          {
            "id": "c3",
            "title": "Give more to families who helped in preparation",
            "description": "Reward effort, but punish others.",
            "risk": "medium",
            "reward": "low",
            "effects": {
              "resources": {
                "trust": -6
              },
              "relationships": {
                "neighbors": -6
              },
              "hidden": {
                "ethics": -8,
                "leadership": -6
              }
            },
            "next": "n4"
          }
        ]
      },
      {
        "id": "n4",
        "type": "random",
        "text": "Hour 18: The storm hits harder than predicted. A roof collapses.",
        "effects": {
          "resources": {
            "health": -6,
            "energy": -6,
            "time": -2
          }
        },
        "next": "n5"
      },
      {
        "id": "n5",
        "type": "decision",
        "text": "Crisis: Roof collapse, people injured, storm ongoing. What do you do?",
        "choices": [
          {
            "id": "c1",
            "title": "Organize rescue team, move injured to safe shelter, continue monitoring",
            "description": "Multi-thread crisis response.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "energy": -8,
                "trust": 10
              },
              "relationships": {
                "neighbors": 10,
                "friends": 8
              },
              "hidden": {
                "adaptability": 15,
                "leadership": 15,
                "ethics": 10
              }
            },
            "next": "n6"
          },
          {
            "id": "c2",
            "title": "Focus only on rescue, ignore storm monitoring",
            "description": "Rescue priority, but new danger.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "energy": -6,
                "health": -4
              },
              "relationships": {
                "neighbors": 6
              },
              "hidden": {
                "risk_management": -4,
                "adaptability": 6
              }
            },
            "next": "n6"
          },
          {
            "id": "c3",
            "title": "Wait for official rescue teams",
            "description": "Pass responsibility, delay help.",
            "risk": "high",
            "reward": "low",
            "effects": {
              "resources": {
                "trust": -8,
                "health": -4
              },
              "relationships": {
                "neighbors": -8
              },
              "hidden": {
                "leadership": -12,
                "ethics": -10
              }
            },
            "next": "n6"
          }
        ]
      },
      {
        "id": "n6",
        "type": "decision",
        "text": "Aftermath: Rebuilding begins. What is your first focus?",
        "choices": [
          {
            "id": "c1",
            "title": "Build a community emergency fund and stronger shelter",
            "description": "Future resilience.",
            "risk": "low",
            "reward": "high",
            "effects": {
              "resources": {
                "money": -2000,
                "knowledge": 8
              },
              "relationships": {
                "neighbors": 10,
                "elders": 8
              },
              "hidden": {
                "prediction": 12,
                "planning": 12,
                "resource_optimization": 10
              }
            },
            "next": "ending"
          },
          {
            "id": "c2",
            "title": "Rebuild exactly as before",
            "description": "Restore normality, ignore future risk.",
            "risk": "medium",
            "reward": "medium",
            "effects": {
              "resources": {
                "money": -1500
              },
              "hidden": {
                "prediction": -4,
                "planning": -2
              }
            },
            "next": "ending"
          },
          {
            "id": "c3",
            "title": "Leave the neighborhood and move elsewhere",
            "description": "Personal survival, abandon community.",
            "risk": "high",
            "reward": "low",
            "effects": {
              "resources": {
                "trust": -10
              },
              "relationships": {
                "neighbors": -10,
                "friends": -8
              },
              "hidden": {
                "ethics": -15,
                "leadership": -15
              }
            },
            "next": "ending"
          }
        ]
      },
      {
        "id": "ending",
        "type": "ending",
        "text": "The storm passes. The community is scarred but standing. Some leaders are made in crisis.",
        "reflection": [
          "What was the most urgent versus the most important decision?",
          "How does preparation reduce panic?"
        ]
      }
    ]
  }
]
};
