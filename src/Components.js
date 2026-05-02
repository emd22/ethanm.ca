
export const ReactiveContainer = (props) => {
  return (
    <div className={`hp-flex-row hp-tablet-flex-col hp-hero-box ${props.className}`}>
      {props.children}
    </div>
  )
}

export const BlogContainer = (props) => {
  return (
    <div className={`hp-hero-box ${props.className}`}>
      {props.children}
    </div>
  )
}

export const RefLink = (props) => {
  return (
    <a href={props.href} className='hp-ref-link'>[{props.text}]</a>
  );
}

export const ProjectVideo = (props) => {
  return (
    <video loop playsInline autoPlay muted src={props.src} alt={props.alt} />
  );
}
