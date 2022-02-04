import { useState, useEffect, useRef } from 'react';

import Typography from 'components/common/Typography';
import TextField from 'components/common/TextField';

type TitleProps = {
  title: string;
  onChange: (newTitle: string) => void;
};

const Title = ({ title, onChange }: TitleProps) => {
  const textFieldRef = useRef<HTMLInputElement>(null);
  const [modifying, setModifying] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    if (textFieldRef.current && modifying) {
      textFieldRef.current.focus();
    }
  }, [modifying, changed, setChanged]);

  useEffect(() => {
    if (modifying) {
      setChanged(true);
    }
  }, [changed, modifying]);

  useEffect(() => {
    if (changed && !modifying && newTitle.length > 0) {
      onChange(newTitle);
      setChanged(false);
    }
  }, [modifying, changed, newTitle, setChanged, onChange]);

  if (modifying) {
    return (
      <TextField
        ref={textFieldRef}
        defaultValue={title}
        onBlur={() => setModifying(false)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') setModifying(false);
        }}
        onChange={(e) => setNewTitle(e.target.value)}
      />
    );
  }

  return (
    <Typography size="lg" weight="bold" onClick={() => setModifying(true)}>
      {title}
    </Typography>
  );
};

export default Title;
