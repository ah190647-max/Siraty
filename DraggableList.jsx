import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'hello-pangea/dnd';
import useResumeStore from '../store/useResumeStore';

export default function DraggableExperienceList() {
  const experience = useResumeStore((state) => state.experience);
  const reorderExperience = useResumeStore((state) => state.reorderExperience);
  const updateExperience = useResumeStore((state) => state.updateExperience);
  const addBullet = useResumeStore((state) => state.addBullet);
  const updateBullet = useResumeStore((state) => state.updateBullet);
  const removeExperience = useResumeStore((state) => state.removeExperience);
  const removeBullet = useResumeStore((state) => state.removeBullet);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    reorderExperience(result.source.index, result.destination.index);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="exp-list">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {experience.map((exp, index) => (
              <Draggable key={exp.id} draggableId={exp.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="drag-item"
                    role="listitem"
                    aria-label={`Experience ${index + 1}`}
                  >
                    <div className="drag-header">
                      <span className="drag-icon" aria-hidden="true">⠿</span>
                      <input
                        placeholder="المسمى الوظيفي"
                        value={exp.title}
                        onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                        aria-label="المسمى الوظيفي"
                      />
                      <button
                        onClick={() => removeExperience(exp.id)}
                        className="remove-btn"
                        aria-label="حذف الخبرة"
                      >
                        ✖
                      </button>
                    </div>
                    <input
                      placeholder="الشركة"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                      aria-label="الشركة"
                    />
                    {exp.bullets?.map((b, bi) => (
                      <div key={`${exp.id}-bullet-${bi}`} className="bullet-row">
                        <input
                          style={{ width: '90%' }}
                          placeholder="نقطة"
                          value={b}
                          onChange={(e) => updateBullet(exp.id, bi, e.target.value)}
                          aria-label={`نقطة ${bi + 1}`}
                        />
                        <button
                          onClick={() => removeBullet(exp.id, bi)}
                          className="small-remove"
                          title="حذف النقطة"
                          aria-label="حذف النقطة"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button onClick={() => addBullet(exp.id)} className="small-btn" aria-label="إضافة نقطة">
                      + نقطة
                    </button>
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