import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import Checkmark from "../Checkmark";

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          <div className={clsx("col col--3")}>
            <div className="text--center">
              <img style={{ maxHeight: "100px" }} src="/img/world.svg"></img>
            </div>
            <div className="text--center padding-horiz--md">
              <h3>Runs anywhere<Checkmark/></h3>
              <p>
              Application is self-contained in a single binary and works on <b>all</b> platforms and <b>any</b> filetype.
              </p>
            </div>
          </div>
          <div className={clsx("col col--3")}>
            <div className="text--center">
              <img style={{ maxHeight: "100px" }} src="/img/logic.svg"></img>
            </div>
            <div className="text--center padding-horiz--md">
              <h3>Powerful Logic<Checkmark/></h3>
              <p>
                Use if/else logic to modify parts of your file, import external data from APIs, output environemnt variables etc.
              </p>
            </div>
          </div>
          <div className={clsx("col col--3")}>
            <div className="text--center">
              <img style={{ maxHeight: "100px" }} src="/img/node.svg"></img>
            </div>
            <div className="text--center padding-horiz--md">
              <h3>Execute JavaScript<Checkmark/></h3>
              <p>
                Run custom JS code anywhere with full access to all Node.js APIs like <i>process</i>.
              </p>
            </div>
          </div>
          <div className={clsx("col col--3")}>
            <div className="text--center">
              <img style={{ maxHeight: "100px" }} src="/img/docker.webp"></img>
            </div>
            <div className="text--center padding-horiz--md">
              <h3>Designed for containers<Checkmark/></h3>
              <p>
                Easily run it in a docker container using a single executable.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
