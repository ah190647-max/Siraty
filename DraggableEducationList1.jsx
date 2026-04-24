import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'hello-pangea/dnd';
import useResumeStore from '../store/useResumeStore';

export default function DraggableEducationList() {
  const education = useResumeStore((state) => state.education);
  const reorderEducation = useResumeStore((state) => state.reorderEducation);
  const updateEducation = useResumeStore((state) => state.updateEducation);
  const removeEducation = useResumeStore((state) => state.removeEducation);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    reorderEducation(result.source.index, result.destination.index);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="edu-list">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {education.map((edu, index) => (
              <Draggable key={edu.id} draggableId={edu.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="drag-item"
                    role="listitem"
                    aria-label={`Education ${index + 1}`}
                  >
                    <div className="drag-header">
                      <span className="drag-icon" aria-hidden="true">⠿</span>
                      <input
                        placeholder="الدرجة"
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                        aria-label="الدرجة"
                      />
                      <button
                        onClick={() => removeEducation(edu.id)}
                        className="remove-btn"
                        aria-label="حذف التعليم"
                      >
                        ✖
                      </button>
                    </div>
                    <input
                      placeholder="المؤسسة"
                      value={edu.school}
                      onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                      aria-label="المؤسسة التعليمية"
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}