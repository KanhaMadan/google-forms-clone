from pydantic import BaseModel
from typing import List, Optional, Union
from datetime import datetime

class FieldOption(BaseModel):
    label: str
    value: str

class Field(BaseModel):
    id: str
    question: str
    type: str  # 'short_answer', 'long_answer', 'number', 'yes/no', 'single_choice', 'multiple_choice', 'date'
    required: bool = False
    options: Optional[List[str]] = None

class Form(BaseModel):
    id: Optional[str] = None
    title: str
    description: Optional[str] = ""
    fields: List[Field]
    created_at: Optional[datetime] = None

class FormCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    fields: List[Field]

class FormUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    fields: Optional[List[Field]] = None

class Response(BaseModel):
    id: Optional[str] = None
    form_id: str
    answers: dict  # field_id: answer
    submitted_at: Optional[datetime] = None

class ResponseCreate(BaseModel):
    form_id: str
    answers: dict