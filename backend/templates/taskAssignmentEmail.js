const taskAssignmentEmail = (userName, task) => {

  return `
    <div style="font-family: Arial; padding: 20px;">

      <h2>Hello ${userName},</h2>

      <p>A new task has been assigned to you.</p>

      <h3>${task.title}</h3>

      <p>${task.description}</p>

      <p>
        <strong>Priority:</strong> ${task.priority}
      </p>

      <p>
        <strong>Status:</strong> ${task.status}
      </p>

      <p>
        <strong>Due Date:</strong>
        ${new Date(task.dueDate).toLocaleDateString()}
      </p>

      <p>Please log in to your dashboard to view the task.</p>

      <p>Thank you!</p>

      <strong>Task Management Team</strong>

    </div>
  `;
};

module.exports = taskAssignmentEmail;