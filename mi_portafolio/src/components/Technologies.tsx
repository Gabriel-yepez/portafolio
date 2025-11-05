import { Badge } from "./ui/badge";
import css3 from "../assets/css3.svg"
import html5 from "../assets/html5.svg"
import python from "../assets/python.svg"
import react from "../assets/react.svg"
import nodejs from "../assets/nodejs.svg"
import typescript from "../assets/typescript.svg";
import nextjs from "../assets/nextjs.svg";
import tailwind from "../assets/tailwind.svg";
import javascript from "../assets/javascript.svg";
import express from "../assets/express.svg";
import fastapi from "../assets/fastapi.svg";
import postgresql from "../assets/postgresql.svg";
import mongodb from "../assets/mongodb.svg";
import sqlserver from "../assets/sqlserver.svg";
import redis from "../assets/redis.svg";
import firebase from "../assets/firebase.svg";
import googlecloud from "../assets/googlecloud.svg";
import figma from "../assets/figma.svg";
import postman from "../assets/postman.svg";
import git from "../assets/git.svg";
import docker from "../assets/docker.svg";

export function Technologies() {
  const categories = [
    {
      title: "Frontend",
      technologies: [
        { name: "React", svg: react },
        { name: "TypeScript", svg: typescript },
        { name: "Next.js", svg: nextjs },
        { name: "Tailwind CSS", svg: tailwind },
        { name: "HTML5", svg: html5 },
        { name: "CSS3", svg: css3 },
        { name: "JavaScript", svg: javascript },
      ],
    },
    {
      title: "Backend",
      technologies: [
        { name: "Node.js", svg: nodejs },
        { name: "Express", svg: express },
        { name: "Python", svg: python },
        { name: "FastAPI", svg: fastapi },
      ],
    },
    {
      title: "Bases de Datos",
      technologies: [
        { name: "PostgreSQL", svg: postgresql },
        { name: "MongoDB", svg: mongodb },
        { name: "SQLServer", svg: sqlserver },
        { name: "Redis", svg: redis },
        { name: "Firebase", svg: firebase },
      ],
    },
    {
      title: "Herramientas",
      technologies: [
        { name: "Git", svg: git },
        { name: "Docker", svg: docker },
        { name: "Google Cloud", svg: googlecloud },
        { name: "Figma", svg: figma },
        { name: "Postman", svg: postman },
      ],
    },
  ];

  return (
    <section id="technologies" className="py-20 px-4">
      <div className="container mx-auto">
        <section className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="mb-4 text-2xl font-semibold">Tecnologías</h2>
          <p className="text-lg text-muted-foreground">
            Estas son algunas de las tecnologías y herramientas con las que trabajo
          </p>
        </section>

        <article className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {categories.map((category, index) => (
            <div key={index} className="space-y-4">
              <h3>{category.title}</h3>
              <div className="flex flex-wrap gap-2">
              {category.technologies.map((tech, techIndex) => (
                <Badge
                key={techIndex}
                variant="secondary"
                className="px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-colors cursor-default flex items-center"
                >
                {tech.svg && (
                  <img
                  src={tech.svg}
                  alt={tech.name}
                  className="w-6 h-6 mr-2 inline-block"
                  />
                )}
                {tech.name}
                </Badge>
              ))}
              </div>
            </div>
          ))}
        </article>
      </div>
    </section>
  );
}