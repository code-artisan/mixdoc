import React, { useState } from 'react';
import { map } from 'lodash';

import './index.scss';

type Slug = {
  heading: string;
  value: string;
  depth: number;
};

type SlugProp = {
  slugs: Array<Slug>;
};

export default (props: SlugProp) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const slugs = props.slugs.filter(slug => slug.depth <= 2);

  return (
    slugs.length > 0 && (
      <div className="docs-slug-list">
        <ul>
          {map(slugs, (slug, index) => (
            <li key={index} className={index === selectedIndex ? 'active' : ''}>
              <a
                href={`#${slug.heading}`}
                onClick={() => setSelectedIndex(index)}
              >
                {slug.heading.toUpperCase()}
              </a>
            </li>
          ))}
        </ul>
      </div>
    )
  );
};
