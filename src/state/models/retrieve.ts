import { createModel } from "@captaincodeman/rdx";
import { Store, State } from "../store";
import { firestoreLoader } from "../firebase";
//REPLACEMENTS0
            import { Media } from "./media"

// Please note that this default export of createModel() is re-exported
// as delta in ../ index.ts, then consumed by getState() below
// as state.delta.
// This could be confusing, even if it does make perfect sense, eventually

const allCollections: string[] = [
  //REPLACEMENTS1
            "media",
            
            
];
export default createModel({
  state: {},

  reducers: {},

  effects: (store: Store) => ({
    async nullAllExcept(_running: string[]) {
      console.log(store)//to keep ts lint from complaining
      const db = await firestoreLoader;
      allCollections.forEach(collection => {
        if (!_running.includes(collection)) {
          let ref = db.collection(collection);
          if (ref!!) {
            ref.onSnapshot(() => {});
            console.log("DETACHING ", collection);
          }
        }
      });
    },

            async media() {
              const db = await firestoreLoader;
              let ref = db.collection("media");
              if (ref!!) {
                const dispatch = store.getDispatch();
                dispatch.retrieve.nullAllExcept(["media"]);
                ref.onSnapshot(snapshot => {
                  let changes = snapshot.docChanges();
                  changes.forEach(change => {
                    console.log(`"INSTANTIATING Media${JSON.stringify(change.doc.data()["name"])}`);
                    if (change.type == "added") {
                      const dcmnt: Media = {
                        id: change.doc.id,
                        name: change.doc.data()["name"]
                      };
                      dispatch.media.upsert(dcmnt);
                    }
                    if (change.type == "removed") {
                      dispatch.media.deleteDcmnt(change.doc.id);
                    }
                  });
                });
              }
            },        
            

  })
});

export const getState = (state: State) => state.retrieve;
