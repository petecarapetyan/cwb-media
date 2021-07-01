import {html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import { Connected, State } from './connected'
import { sharedStyles } from './shared-styles'
import { dispatch } from "../state";
import { MediaSelectors } from "../state/models/media";

declare global {
  interface HTMLElementTagNameMap {
    'view-media': Media
  }
}

@customElement('view-media')
export class Media extends Connected {
  @property({ type: Object,
    hasChanged(_newVal, _oldVal) {
      return true; // thus always render. No, I don't understand why, just the only way to get it to work.
    }
  })
  mediaClctn: {}


  mapState(state: State) {
    return {
      mediaClctn: MediaSelectors.mediaClctn(state),
    }
  }


  delete(_e: Event) {
    dispatch.media.delete(_e?.target?.["id"])
  }


  render() {
    console.log(`FOUND ${this.mediaClctn}`)
    return html`
    <h3>Media</h3>
    <!-- <a href="/mediaC"><button type="button">Add Media Document</button></a> -->
    <div class="table">
        ${Object.keys(this.mediaClctn).map(key => {
          console.log(`HERE ${key}`)
          const dcmnt = this.mediaClctn[key];
          return html`
            <div class="row">
              <div class="cell">
                <button id=${dcmnt["id"]} @click=${this.delete}>delete</button>
              </div>
              <div class="cell">${dcmnt["name"]}</div>
            </div>
          `;
        })}
      </div>
    `;
  }

  static get styles() {
    return [
      sharedStyles,
      css`
        button {
          padding: 1em;
          margin-bottom: 2em;
        }
        .table .row {
          display: grid;
          grid-gap: 10px;
          padding: 0;
          list-style: none;
          grid-template-columns: auto  1fr 1fr 1fr 1fr;
        }
        .cell {
          background: #f9f7f5;
          display: block;
          text-decoration: none;
          padding: 10px;
          text-align: center;
          font-size: 10px;
        }
      `,
    ]
  }
}
