import React, { useRef, useEffect } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import styles from './index.module.css';
import CodeBlock from '@theme/CodeBlock';
import Typed from "typed.js";

const input = (text) => '<span style="color:red">$</span> <span class="cb-input">' + text + '</span> ^100 '
const output = (text) => '`<span class="cb-output">' + text + '</span>` '
const br = (text) => '<br/>'

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();

  const el = useRef(null);
  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: [input("cat test.txt") + br() + output("\
      Today is ${{´new Date().toLocaleString()´}} <br/>\
      $[ifeq foo bar]$ <br/>\
      Hello ${{foo}}$ <br/>\
      $[else]$ <br/>\
      Bye <br/>\
      $[end]$") + br() + input("utpp -p test.txt foo=bar") + br() + output("\
        Today is "+ new Date().toLocaleString() + " <br/>\
        Hello bar <br/>\
      ")],
      typeSpeed: 50,
      // loop: true,
      showCursor: false,
    });

    return () => {
      // Destroy Typed instance during cleanup to stop animation
      typed.destroy();
    };
  }, []);

  return (
    <header className={clsx('hero hero--white bg-1', styles.heroBanner)}>
      <div className="container">
        <div className="row">
          <div className="col col--6">
            <div style={{
              borderRadius: "5px", color: "white", background: "black",
              background: "linear-gradient(60deg, #1f1f1f 0%, rgba(0,0,0,1) 100%)",
              textAlign: "left", border: "#13385f 1px solid", padding: "1em", boxShadow: "0px 0px 10px 0px #13385f",
              fontFamily: "monospace"
            }} ref={el}></div>


          </div>
          <div className="col col--6" style={{ margin: "auto" }}>
            <h1 className="hero__title" style={{ color: "white" }}>{siteConfig.title}</h1>
            <p className="hero__subtitle" style={{ color: "white" }}>Universal Text Pre-Processor</p>
            <p style={{ color: "white" }}>Pre-process files using macros</p>
            <div className={styles.buttons}>
              <Link
                className="button button--secondary button--lg"
                to="/intro">
                Get started 🚀
              </Link>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}

function Section2() {
  return <div>

  </div>
}

function Section3() {

  const el = useRef(null);
  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: [
        input("cat php.ini") + br() + output("\
        memory_limit=${{´process.env.MEM_LIMIT ?? '256M'´}}$ <br/>\
        display_errors=${{´process.env.DISPLAY_ERRORS ?? 'Off'´}}$ <br/>\
        ") + input("docker run my/image -e MEM_LIMIT=512M") + br() + output("my/image | Executing:  utpp \"*/**\"") + br() + input("cat /inside-image/php.ini") + br() + output("\
        memory_limit=512M <br/>\
        display_errors=Off <br/>\
        ")
      ],
      typeSpeed: 50,
      // loop: true,
      showCursor: false,
    });

    return () => {
      // Destroy Typed instance during cleanup to stop animation
      typed.destroy();
    };
  }, []);

  return (
    <header className={clsx('hero hero--white bg-2', styles.heroBanner)} style={{ color: "white" }}>
      <div className="container">
        <div className="row">
          <div className="col col--6">
            {/* <h1 className="hero__title">Use Cases</h1> */}
            <p className="hero__subtitle">Use Cases</p>
            <ul>
              <li> Dynamically modifiy static config files based on user input</li>
              <li> Replace placeholder with custom eval'd JavaScript on startup</li>
              <li> Start a supervisor service conditionally using docker run arguments. </li>
              <li> Use different compile commands based on user's current architecture</li>
            </ul>
            <div className={styles.buttons}>
              <Link
                className="button button--secondary button--lg"
                to="/examples/docker">
                Real-world example 🌍
              </Link>
            </div>

          </div>
          <div className="col col--6" style={{ margin: "auto" }}>
            <div style={{
              borderRadius: "5px", color: "white", background: "black",
              background: "linear-gradient(60deg, #1f1f1f 0%, rgba(0,0,0,1) 100%)",
              textAlign: "left", border: "#13385f 1px solid", padding: "1em", boxShadow: "0px 0px 10px 0px #13385f",
              fontFamily: "monospace"
            }} ref={el}></div>
          </div>
        </div>
      </div>
    </header>
  );
}

function SectionEnd() {
  return <Link
    to="https://dir.adriansoftware.de"> <div className=" " style={{
      textAlign: "center", background: "#2b70b6", textAlign: "center",
      display: "flex",
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center", /* "var(--ifm-color-gray-100)" */
    }}>

      <p className="hero__subtitle" style={{ color: "var(--ifm-color-gray-400)" }}>Projects using <kbd>utpp</kbd> </p>
      <img /* style={{ boxShadow: "0px 0px 10px 0px #8585857d" }} */ height={130} src="/img/dir.png" />
    </div>
  </Link>
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        {/* <Section2 /> */}
        <HomepageFeatures />
        <Section3 />
        {/* <SectionEnd /> */}
      </main>
    </Layout >
  );
}
