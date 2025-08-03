import fs from 'fs';
import yaml from 'js-yaml';

type Legislator = {
  id: Record<string, string | string[]>;
  name: Record<string, string>;
  bio: Record<string, string>;
  terms: Array<Record<string, string>>;
};

const INPUT_FILE = 'src/app/data/legislators-current.yaml';
const OUTPUT_FILE = 'src/app/data/legislators-min.json';
function transform() {
  const fileContent = fs.readFileSync(INPUT_FILE, 'utf8');
  const data = yaml.load(fileContent) as Legislator[];

  const transformed = data.map((legislator) => {
    const currentTerm = legislator.terms[legislator.terms.length - 1];
    return {
      id: legislator.id,
      name: legislator.name,
      bio: legislator.bio,
      term: currentTerm,
    };
  });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(transformed, null, 2));
  console.log(`Transformed data written to ${OUTPUT_FILE}`);
}

transform();
