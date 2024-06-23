
var uuid = require("uuid");
const FILE_PREFIX = "sketch2_";
const PROJECT_NAMES_KEY = "sketch3_projectNames";
const FIRESTORE_COLLECTION_PROJECT = "sketch_project";
const FIRESTORE_COLLECTION_PROJECT_NAME = "sketch_project_name";
const FIRESTORE_COLLECTION_MEMO = "sketch_memo";

const MEMO_PREFIX = "memo_";
const MEMO_KEY = "memo_key";

const STORAGE_MODE_LOCAL = "local";
const STORAGE_MODE_SERVER = "server";
var STORAGE_MODE = STORAGE_MODE_LOCAL;

async function newProject({ newId, title, jsonData = null }) {
  const key = `${FILE_PREFIX}${newId}`;
  console.log("newid" + newId);
  console.log("title" + title);

  if (jsonData == null) {
    jsonData = {
      id: key,
      project_name: title,

      sections: [
        {
          id: "1",
          title: "Section 1",
          shots: [
            {
              id: "1",
              script: "",
              description: "",
              fixedEstimatedTime: 1,
              estimatedTime: 1,
            },
          ],
        },
        {
          id: "2",
          title: "Section 2",
          shots: [{ id: "1", script: "", description: "", fixedEstimatedTime: 1, estimatedTime: 1 }],
        },
      ],
      memo: "",
      videoUrl: "",
    };
  } else {
    jsonData.id = key;
  }

  if (STORAGE_MODE == STORAGE_MODE_LOCAL) {
    const data = JSON.stringify(jsonData);
    localStorage.setItem(key, data);

    let projectNames = await loadProjects();

    projectNames.push({
      id: key,
      name: title,
      createdAt: getCurrentTime(),
    });
    localStorage.setItem(PROJECT_NAMES_KEY, JSON.stringify(projectNames));
  } else {
    // const itemDoc = doc(db, FIRESTORE_COLLECTION_PROJECT, key);
    // await setDoc(itemDoc, jsonData);

    // const nameDoc = doc(db, FIRESTORE_COLLECTION_PROJECT_NAME, key);
    // await setDoc(nameDoc, {
    //   name: title,
    //   createdAt: getCurrentTime(),
    // });
  }

  return key;
}

async function copyProject(id) {
  const project = await getProject(id);
  let genId = uuid.v4();
  let newTitle = project.project_name + "(2)";

  await newProject({
    newId: genId,
    title: newTitle,
    jsonData: project,
  });
}

async function getProject(projectId) {
  if (STORAGE_MODE == STORAGE_MODE_LOCAL) {
    const data = localStorage.getItem(projectId);
    if (!data) {
      return null;
    }
    return JSON.parse(data);
  } else {
    let docRef = doc(db, FIRESTORE_COLLECTION_PROJECT, projectId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  }
}

function updateProject(project) {
  if (STORAGE_MODE == STORAGE_MODE_LOCAL) {
    const data = JSON.stringify(project);
    localStorage.setItem(project.id, data);
  } else {
    // const docRef = doc(db, FIRESTORE_COLLECTION_PROJECT, project.id);
    // setDoc(docRef, project);
  }
}

async function changeProjectName(projectId, name) {
  if (STORAGE_MODE == STORAGE_MODE_LOCAL) {
    let projectNames = await loadProjects();
    const selectedItem = projectNames.find((item) => item.id === projectId);
    if (selectedItem) {
      selectedItem.name = name;
    }
    localStorage.setItem(PROJECT_NAMES_KEY, JSON.stringify(projectNames));
  } else {
    // const docRef = doc(db, FIRESTORE_COLLECTION_PROJECT_NAME, projectId);
    // updateDoc(docRef, {
    //   name: name,
    // });
  }
}

async function loadProjects() {
  if (STORAGE_MODE == STORAGE_MODE_LOCAL) {
    const projectNames = localStorage.getItem(PROJECT_NAMES_KEY);
    if (projectNames === null || projectNames === undefined) {
      return [];
    }
    return JSON.parse(projectNames);
  } else {
    // const querySnapshot = await getDocs(collection(db, FIRESTORE_COLLECTION_PROJECT_NAME));
    // return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
}

async function deleteProject(projectId) {
  if (STORAGE_MODE == STORAGE_MODE_LOCAL) {
    localStorage.removeItem(projectId);

    let projectNames = await loadProjects();
    const index = projectNames.findIndex((item) => item.id === projectId);
    if (index !== -1) {
      projectNames.splice(index, 1);
    }
    localStorage.setItem(PROJECT_NAMES_KEY, JSON.stringify(projectNames));
  } else {
    // const docRef = doc(db, FIRESTORE_COLLECTION_PROJECT_NAME, projectId);
    // await deleteDoc(docRef);
  }
}

function getCurrentTime() {
  return new Date().toISOString();
}

async function newMemo({ newId, title }) {
  const key = `${MEMO_PREFIX}${newId}`;
  console.log("newid" + newId);
  console.log("title" + title);

  if (STORAGE_MODE == STORAGE_MODE_LOCAL) {
    let memos = await loadMemos();

    memos.push({
      id: key,
      name: title,
      content: "",
      createdAt: getCurrentTime(),
    });
    localStorage.setItem(MEMO_KEY, JSON.stringify(memos));
  } else {
    const nameDoc = doc(db, FIRESTORE_COLLECTION_MEMO, key);
    await setDoc(nameDoc, {
      id: key,
      name: title,
      content: "",
      createdAt: getCurrentTime(),
    });
  }

  return key;
}

async function updateMemo(memo) {
  if (STORAGE_MODE == STORAGE_MODE_LOCAL) {
    let memos = await loadMemos();
    const selectedItem = memos.find((item) => item.id === memo.id);
    if (selectedItem) {
      selectedItem.content = memo.content;
    }
    localStorage.setItem(MEMO_KEY, JSON.stringify(memos));
  } else {
    // const docRef = doc(db, FIRESTORE_COLLECTION_MEMO, memo.id);
    // setDoc(docRef, memo);
  }
}

async function loadMemos() {
  if (STORAGE_MODE == STORAGE_MODE_LOCAL) {
    const memos = localStorage.getItem(MEMO_KEY);
    if (memos === null || memos === undefined) {
      return [];
    }
    return JSON.parse(memos);
  } else {
    // const querySnapshot = await getDocs(collection(db, FIRESTORE_COLLECTION_MEMO));
    // return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
}

async function deleteMemo(id) {
  if (STORAGE_MODE == STORAGE_MODE_LOCAL) {
    // localStorage.removeItem(projectId); // 특정 키를 가진 데이터 삭제
    // let projectNames = await loadProjects();
    // const index = projectNames.findIndex((item) => item.id === projectId);
    // if (index !== -1) {
    //   projectNames.splice(index, 1);
    // }
    // localStorage.setItem(PROJECT_NAMES_KEY, JSON.stringify(projectNames));
  } else {
    // const docRef = doc(db, FIRESTORE_COLLECTION_MEMO, id);
    // await deleteDoc(docRef);
  }
}

export default { newProject, copyProject, loadProjects, getProject, updateProject, deleteProject, changeProjectName, newMemo, loadMemos, updateMemo, deleteMemo };
